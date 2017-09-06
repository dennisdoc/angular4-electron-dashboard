const {app, BrowserWindow} = require('electron');

var htmlreplace = require('gulp-html-replace');
var gulp = require('gulp');

gulp.src('/electron/dist/dev/index.html').pipe(
  htmlreplace({
    js: {
      src: './',
      tpl: "<base href='%s'>"
    }
  }),

  htmlreplace({'preJs': "<script>if (typeof module === 'object') {window.module = module; module = undefined;}</script>"}),
  htmlreplace({'posJs': "<script>if (window.module) module = window.module;</script>"})
);

let mainWindow;

app.on('ready', function() {
  mainWindow = new BrowserWindow({x:100, y:100, width: 400, height: 420});
  mainWindow.loadURL('file://' + __dirname + '/electron/dist/dev/index.html');
  mainWindow.on('close', () => {
    for (let window of BrowserWindow.getAllWindows()) {
      if (window != mainWindow)
        window.close();
    }
  })
});
