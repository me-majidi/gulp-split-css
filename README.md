# gulp-split-css
Gulp plugin that can split CSS files into multiple files base on conditions and selectors. It can break CSS files for multi-language applications and create different stylesheets for each language.

## Installation
```shell
npm install gulp-split-css
```

## Example
```javascript
const  gulp  =  require('gulp');
const  splitCss  =  require('gulp-split-css');

const  options  =  {
	mainFileName:  'main',
	extraSheets: [{
		selector:  '.lang-en',
		filename:  'english'
		},
		{
		selector:  '#french',
		filename:  'styles.french.css'
		},
		{
		selector:  '.persian',
		filename:  'persian.css'
		}]
};

gulp.task('splitCss',  function  ()  {
	return  gulp.src('./src/app.css')
		.pipe(splitCss(options))
		.pipe(gulp.dest('./dist/'));
});
```
```css
input  {
	border-radius:  4px;
	background:  black;
	color:  #fff
}

.box {
	font-size:  12px;
	line-height:  16px;
	padding:  8px  10px;
	overflow:  hidden
}

.lang-en  .box  {
	font-size:  14px;
	line-height:  20px;
	padding:  10px  15px;
	margin-left:  4px
}

#french .box {
	font-size:  12px;
	line-height:  16px;
	padding:  8px  10px;
}

.persian * {
	direction: rtl;
}
```
Task `splitCss` generates following files:

`main.css`
```css
input  {
	border-radius:  4px;
	background:  black;
	color:  #fff
}

.box {
	font-size:  12px;
	line-height:  16px;
	padding:  8px  10px;
	overflow:  hidden
}
```
`english.css`
```css
.lang-en  .box  {
	font-size:  14px;
	line-height:  20px;
	padding:  10px  15px;
	margin-left:  4px
}
```

`styles.french.css`
```css
#french .box {
	font-size:  12px;
	line-height:  16px;
	padding:  8px  10px;
}
```

`persian.css`
```css
.persian * {
	direction: rtl;
}
```
