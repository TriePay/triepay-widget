import { BigNumber } from 'bignumber.js';

export const Host = 'https://api.triepay.io';

export const ADDRESS_NATIVE_CURRENCY = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

export const tlc = str => str?.toLowerCase?.();

export const toLowerCaseEquals = (a, b) => {
    if (!a && !b) return false;
    return tlc(a) === tlc(b);
};

export const getChainIdByName = (blockchain) => {
    switch (blockchain) {
        case 'bsc':
            return '56';
        case 'polygon':
            return '137';
        case 'fantom':
            return '250';
        case 'avalanche':
            return '43114';
        case 'ethereum':
            return '1';
    }
    return undefined;
}

export const getPayContract = (chainId) => {
    switch (chainId) {
        case '1':
        case '56':
        case '137':
        case '250':
        case '43114':
            return '0x504356d1893813e92b5534627aBa342efE54db69';
    }
    return undefined;
}

export const toFixed = (amount, usd) => {
    return new BigNumber(amount).multipliedBy(usd).dp(2).toString(10);
}

export const toTokenMinimalUnit = (value, decimals) => {
    const base = Math.pow(10, decimals);
    return new BigNumber(value).multipliedBy(base).toFixed(0);
}

export const getSelectTokenInfo = (selectToken, balances, supportTokens, payments) => {
    if (!payments?.length) {
        return undefined;
    }

    let tokenInfo = undefined;
    if (selectToken?.address && selectToken?.chainId) {
        const acceptToken = payments.find(item => item.blockchain && selectToken.chainId === getChainIdByName(item.blockchain));
        const token = supportTokens[selectToken.chainId]?.[tlc(selectToken.address)];
        const acceptTokenInfo = supportTokens[selectToken.chainId]?.[tlc(acceptToken.token)];
        if (acceptToken && token && acceptTokenInfo) {
            tokenInfo = { ...token, ...acceptToken, selectAddress: tlc(selectToken.address), chainId: selectToken.chainId, acceptSymbol: acceptTokenInfo.symbol, acceptDecimals: acceptTokenInfo.decimals };
        }
    }
    if (!tokenInfo) {
        for (const item of payments) {
            if (!item?.blockchain) {
                continue;
            }
            const chainId = getChainIdByName(item.blockchain);
            const token = supportTokens?.[chainId]?.[tlc(item.token)];
            if (token) {
                tokenInfo = { ...token, ...item, selectAddress: tlc(item.token), chainId };
                break;
            }
        }
    }

    if (!tokenInfo) {
        return undefined;
    }

    if (balances?.length) {
        const balance = balances.find(balance => balance.chainId == tokenInfo.chainId);
        if (balance?.tokens) {
            const index = balance.tokens?.findIndex(token => toLowerCaseEquals(token, tokenInfo.selectAddress));
            if (index >= 0) {
                tokenInfo.balance = balance.balances[index];
                tokenInfo.useAmount = balance.amounts[index];
            }
        }
    }
    return tokenInfo;
}

export const isNativeCurrency = (address) => {
    return toLowerCaseEquals(address, ADDRESS_NATIVE_CURRENCY);
}

export const uploadTxInfo = (chainId, txHash, callback, merchant, orderId, title) => {
    const body = { chain_id: chainId, tx_hash: txHash, callback, receiver: merchant, order_id: orderId, title };
    const options = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    };
    console.log('uploadTxInfo body:', body);
    return fetch(`${Host}/v1/upload_txinfo`, options).then(res => res.json()).then(res => {
        console.log('uploadTxInfo res', res);
    }).catch(e => {
        console.log('uploadTxInfo fail', e);
    })
}


export const ethCall = (chainId, method, address, params = undefined) => {
    let url = `${Host}/v1/eth_call/${chainId}/${method}`;
    let extend;
    if (address) {
        extend = `address=${address}`;
    }
    if (params) {
        if (extend) {
            extend += `&`;
        } else {
            extend = '';
        }
        extend += `params=${JSON.stringify(params)}`;
    }
    if (extend) {
        url += `?${extend}`;
    }
    console.log('ethCall url:', url);
    return fetch(url).then(res => res.json()).then(res => {
        if (res.message === 'OK' && res.status === "1" && res.result) {
            return res.result;
        }
        throw new Error(`ethCall fail, res:${res}`);
    });
}

export const getBalance = async (user, chainId, unitPrice, quantity, token) => {
    const body = { user, payments: [{ chainId, unitPrice, quantity, merchantTokenAddress: token }] };
    const options = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    };
    return await fetch(`${Host}/v1/get_balances`, options).then(res => res.json()).then(res => {
        // console.log('getBalance:', res);
        if (res.message === 'OK' && res.status === "1" && res.result?.payments) {
            // console.log('getBalance result:', res.result.payments);
            return res.result.payments[0];
        }
        return undefined;
    }).catch(e => {
        console.log('getBalance fail', e);
        return undefined;
    })
}

export const getNativeCurrencyBalance = async (user, chainId, unitPrice, quantity, token) => {
    const balance = await getBalance(user, chainId, unitPrice, quantity, token);
    if (balance?.tokens) {
        const index = balance.tokens?.findIndex(token => toLowerCaseEquals(token, ADDRESS_NATIVE_CURRENCY));
        if (index >= 0) {
            return balance.amounts[index];
        }
    }
    return undefined;
}

export const getStatus = async (merchant, orderId) => {
    return await fetch(`${Host}/v1/get_status/${merchant}/${orderId}`)
        .then(res => res.json()).then(res => {
            if (res.message === 'OK' && res.status === "1" && res.result) {
                return res.result.status;
            }
            return -1;
        }).catch(e => -1);
}

export const sleep = async (time) => {
    await new Promise((resolve => {
        setTimeout(() => resolve(true), time);
    }));
}

export const asciiToHex = function(str) {
    if(!str)
        return "0x00";
    let hex = "";
    for(let i = 0; i < str.length; i++) {
        let code = str.charCodeAt(i);
        let n = code.toString(16);
        hex += n.length < 2 ? '0' + n : n;
    }

    return "0x" + hex;
};

export const padRight = function (string, chars, sign) {
    let hasPrefix = /^0x/i.test(string) || typeof string === 'number';
    string = string.toString(16).replace(/^0x/i,'');

    let padding = (chars - string.length + 1 >= 0) ? chars - string.length + 1 : 0;

    return (hasPrefix ? '0x' : '') + string + (new Array(padding).join(sign ? sign : "0"));
};

export const isCancelError = (error) => {
    if (!error) {
        return false;
    }
    return error.message === 'MetaMask Tx Signature: User denied transaction signature.'
        || error.message === 'User rejected the request.'
        || error.toString() === 'Error: User rejected the transaction';
}


export const makeJsonRpcResponse = (request, result, error) => {
    return {
        id: +request.id,
        jsonrpc: request.jsonrpc,
        result,
        error: error ? error.message : undefined,
    }
};


export const addHexPrefix = function (str) {
    if (typeof str !== 'string') {
        return str;
    }

    return isHexPrefixed(str) ? str : '0x' + str;
}

export function isHexPrefixed(str) {
    if (typeof str !== 'string') {
        throw new Error(`[isHexPrefixed] input must be type 'string', received type ${typeof str}`);
    }

    return str[0] === '0' && str[1] === 'x';
}


export function toHex(value) {
    return addHexPrefix(new BigNumber(value,10).toString(16))
}

export function byteLength(str) {
    if(str) {
        let b = 0;
        for(let i = 0; i < str.length; i ++) {
            if(str.charCodeAt(i) > 255) {
                b += 2;
            }else {
                b ++;
            }
        }
        return b;
    } else {
        return 0;
    }
}

export function getByteIndex(str, index) {
    if (!str || index <= 0) {
        return 0;
    }
    let b = 0;
    for (let i = 0; i < str.length; i ++) {
        if (str.charCodeAt(i) > 255) {
            b += 2;
        } else {
            b ++;
        }
        if (b >= index) {
            return i;
        }
    }
    return str.length;
}

export function getLastByteIndex(str, index) {
    if (!str || index <= 0) {
        return 0;
    }
    let b = 0;
    for (let i = str.length - 1; i >= 0; i --) {
        if (str.charCodeAt(i) > 255) {
            b += 2;
        } else {
            b ++;
        }
        if (b >= index) {
            return i;
        }
    }
    return 0;
}
