import livereload from 'rollup-plugin-livereload'
import rollup from './rollup.bundle.config'
import serve from 'rollup-plugin-serve'
import dev from 'rollup-plugin-dev'

export default Object.assign({}, rollup, {
  plugins: [...rollup.plugins,
    serve({
      open: 'true',
      openPage: 'http://127.0.0.1:8080/index.html'
    }),
    dev({
      proxy: [{ from: '/track', to:'http://example.com' }],
    }),
    livereload({
      watch: ['dist', 'src']
    })
  ]
})
