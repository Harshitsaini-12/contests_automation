// node hack.js --url=https://www.hackerrank.com/ --config=work.json

let minimist=require('minimist');
let puppeteer = require('puppeteer');
let fs=require('fs');

let args=minimist(process.argv);
let configJSON=fs.readFileSync(args.config,"utf-8");

let config=JSON.parse(configJSON);


(async () => {
  const browser = await puppeteer.launch({
    headless:false,
    args:[
      '--start-maximized'
    ],
    defaultViewport:null
  });

  const pages = await browser.pages();
  await pages[0].goto(args.url);


  await pages[0].waitForSelector("a[data-event-action='Login']");
  await pages[0].click("a[data-event-action='Login']")

  await pages[0].waitForSelector("a[href='https://www.hackerrank.com/login']");
  await pages[0].click("a[href='https://www.hackerrank.com/login']")

   await pages[0].waitForSelector("input[name='username']");
   await pages[0].type("input[name='username']",config.userid,{delay:30});

   await pages[0].waitForSelector("input[name='password']");
   await pages[0].type("input[name='password']",config.password,{delay:30});

   await pages[0].waitForSelector("button[data-analytics='LoginPassword']");
   await pages[0].click("button[data-analytics='LoginPassword']");

   await pages[0].waitForSelector("a[data-analytics='NavBarContests']");
   await pages[0].click("a[data-analytics='NavBarContests']");

   await pages[0].waitForSelector("a[href='/administration/contests/']");
   await pages[0].click("a[href='/administration/contests/']");

   await pages[0].waitForSelector("p.mmT");
   await pages[0].click("p.mmT");

   await pages[0].waitFor(3000);

   await pages[0].waitForSelector("li[data-tab='moderators']");
   await pages[0].click("li[data-tab='moderators']");

   await pages[0].waitForSelector("input#moderator");
   await pages[0].type("input#moderator",config.moderators,{delay:50});

   await pages[0].keyboard.press("Enter");

   await browser.close();
   console.log("Browser closed");


})();