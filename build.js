const path = require("path");
const fs = require("fs");
const rm = require("rimraf");
const camelCase = require("change-case").camelCase;
const { default: webfont } = require("webfont");
const outputDir = path.join(__dirname, "dist");
const { version } = require("./package.json");

rm.sync(outputDir);
fs.mkdirSync(outputDir);

function docs(result) {
  const { templateClassName, fontName } = result.config;
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <link rel="stylesheet" href="${fontName}.css" />
  <style>
   * {
     margin: 0;
     padding: 0;
     box-sizing: border-box;
   }

   body {
     padding: 1em;
   }

   h1 {
     margin: 1em 0;
   }
    #icons {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(128px, 1fr));
    }

    .icon {
      border: 1px solid #E0E0E0;
      text-align: center;
      padding: 0.5em;
    }

    .icon p {
      font-size: 0.75em;
      margin-top: 1em;
    }

    .primary { color: #44DD62; }
    .white { color: #FFF; }
    .grey-1 { color: #F4F4F4; }
    .grey-2 { color: #D8D8D8; }
    .grey-3 { color: #979797; }
    .grey-4 { color: #454545; }

    .dark {background: #454545;}
  </style>
</head>
<body>
  <h1>${fontName}</h1>
  <div id="icons">
  ${result.glyphsData
    .map(
      (item) =>
        `<div class="icon">
          <div>
          <i class="${templateClassName} ${templateClassName}-${item.metadata.name} ${templateClassName}-3x"></i>
          </div>
          <i class="${templateClassName} ${templateClassName}-${item.metadata.name} primary"></i>
          <i class="${templateClassName} ${templateClassName}-${item.metadata.name} grey-1"></i>
          <i class="${templateClassName} ${templateClassName}-${item.metadata.name} grey-2"></i>
          <i class="${templateClassName} ${templateClassName}-${item.metadata.name} grey-3"></i>
          <i class="${templateClassName} ${templateClassName}-${item.metadata.name} grey-4"></i>
          <div class="dark">
            <i class="${templateClassName} ${templateClassName}-${item.metadata.name} primary"></i>
            <i class="${templateClassName} ${templateClassName}-${item.metadata.name} grey-1"></i>
            <i class="${templateClassName} ${templateClassName}-${item.metadata.name} grey-2"></i>
            <i class="${templateClassName} ${templateClassName}-${item.metadata.name} grey-3"></i>
            <i class="${templateClassName} ${templateClassName}-${item.metadata.name} white"></i>
          </div>
          <p>${templateClassName}-${item.metadata.name}</p>
        </div>`
    )
    .join("\n")}
  </div>
</body>
</html>
  `;
}

function buildWebFont() {
  return webfont({
    files: "icons/*.svg",
    fontName: "PharmaGo-Icons",
    templateClassName: "pgi",
    sort: true,
    centerHorizontally: true,
    normalize: true,
    fixedWidth: 600,
    fontHeight: 128,
    decent: 64,
    formats: ["eot", "ttf", "woff", "woff2"],
    template: path.join(__dirname, "template.css.njk"),
  }).then((result) => {
    console.log(result);

    if (result.template) {
      fs.writeFileSync(
        path.join(outputDir, "PharmaGo-Icons.css"),
        result.template
      );
    }

    if (result.ttf) {
      fs.writeFileSync(path.join(outputDir, "PharmaGo-Icons.ttf"), result.ttf);
    }

    if (result.eot) {
      fs.writeFileSync(path.join(outputDir, "PharmaGo-Icons.eot"), result.eot);
    }

    if (result.woff) {
      fs.writeFileSync(path.join(outputDir, "PharmaGo-Icons.woff"), result.woff);
    }

    if (result.woff2) {
      fs.writeFileSync(
        path.join(outputDir, "PharmaGo-Icons.woff2"),
        result.woff2
      );
    }

    if (result.svg) {
      fs.writeFileSync(path.join(outputDir, "PharmaGo-Icons.svg"), result.svg);
    }

    if (process.argv.includes("--html")) {
      fs.writeFileSync(path.join(outputDir, "index.html"), docs(result));
    }

    return result;
  });
}

async function main() {
  await buildWebFont();
}

main();
