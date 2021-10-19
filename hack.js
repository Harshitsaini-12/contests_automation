// node hack.js --url=https://www.hackerrank.com --config=work.json

let minimist=require('minimist');
let puppeteer = require('puppeteer');
let fs=require('fs');

let args=minimist(process.argv);
let configJSON=fs.readFileSync(args.config,"utf-8");

let config=JSON.parse(configJSON);


async function run(){

  //starting the browser
  const browser = await puppeteer.launch({
    headless:false,
    args:[
      '--start-maximized'
    ],
    defaultViewport:null
  });

  const pages = await browser.pages();
  let page=pages[0];

  await page.goto(args.url);


  await page.waitForSelector("a[data-event-action='Login']");
  await page.click("a[data-event-action='Login']")

  await page.waitForSelector("a[href='https://www.hackerrank.com/login']");
  await page.click("a[href='https://www.hackerrank.com/login']")

   await page.waitForSelector("input[name='username']");
   await page.type("input[name='username']",config.userid,{delay:30});

   await page.waitForSelector("input[name='password']");
   await page.type("input[name='password']",config.password,{delay:30});

   await page.waitFor(3000);

   await page.waitForSelector("button[data-analytics='LoginPassword']");
   await page.click("button[data-analytics='LoginPassword']");

   await page.waitForSelector("a[data-analytics='NavBarContests']");
   await page.click("a[data-analytics='NavBarContests']");

   await page.waitFor(3000);

   await page.waitForSelector("a[href='/administration/contests/']");
   await page.click("a[href='/administration/contests/']");


  //find no of pages --> will give total no of pages
  await page.waitForSelector("a[data-attr1='Last']");

  let numPages=await page.$eval("a[data-attr1='Last']",function(atag){
    
    let totalPages=parseInt(atag.getAttribute("data-page"));
    return totalPages;

  });

    for(let i=1;i<=numPages;i++){
      await handleAllContest(page,browser);

      if(i<numPages){
        await page.waitForSelector("a[data-attr1='Right']");
        await page.click("a[data-attr1='Right']");
      }
    }


   await browser.close();
   console.log("Browser closed");
   
};


async function handleAllContest(page,browser){
  await page.waitForSelector("a.backbone.block-center");


    // for selecting document.selectAll in pupetter
  let curls=await page.$$eval("a.backbone.block-center",function(atags){
      let urls=[];

      for(let i=0;i<atags.length;i++){
          let url=atags[i].getAttribute("href");
          urls.push(url);

      }

      return urls;

  });


   for(let i=0;i<curls.length;i++){
     let curl=curls[i];

     let ctab=await browser.newPage();
       
      await handleContest(ctab,args.url+curl,config.moderators);

      await ctab.close();
      await page.waitFor(3000);
   }
}


async function handleContest(ctab,fullCurl,moderators){
  await ctab.bringToFront();
  await ctab.goto(fullCurl);
  await ctab.waitFor(3000);

   //clicking on moderator tab
   await ctab.waitForSelector("li[data-tab='moderators']");
   await ctab.click("li[data-tab='moderators']");

   //type in moderator
   await ctab.waitForSelector("input#moderator");
   await ctab.type("input#moderator",moderators,{delay:50});

   //enter
   await ctab.keyboard.press("Enter");
}

run();