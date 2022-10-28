/* eslint-disable @typescript-eslint/no-var-requires */
const cp = require("child_process");
const argv = require("yargs").argv;

/**
 * @type {"chrome" | "edge" | "safari12"}
 */
const argBrowser = argv.browser;

/**
 * @type {string}
 */
const baseUrl = argv["base-url"] || "http://localhost:80/profile";

/**
 * @type {"ja" | "en"}
 */
const language = argv["language"] || "en";

let browser = "";

const e2eEnv = {};

if (!argBrowser) {
  throw new Error("browser must be set.");
}

e2eEnv.ARG_BROWSER = argBrowser;

//ブラウザ指定文字列設定
browser = "browserstack:chrome@106.0:Windows 10";
//この値を大きくしすぎるとtestcafeのclip機能がエラーを吐く
//なお現時点でtestcafeにはwindow sizeを指定してブラウザを起動するような機能がないため、test code中から設定する必要がある
// e2eEnv.WIDTH = "1280";
// e2eEnv.HEIGHT = "800";

//browserStack provider用設定
e2eEnv.BROWSERSTACK_PROJECT_NAME = "isx-profile-front";
e2eEnv.BROWSERSTACK_BUILD_ID = `isx-profile-front e2e ${browser}`;

e2eEnv.BROWSERSTACK_PARALLEL_RUNS = 1;
e2eEnv.TESTCAFE_BROWSERSTACK_API_POLLING_INTERVAL = "20000";

//browserstack automateを利用:"1" js testingを利用:デフォルト
//js testingの場合は終了処理がうまくいかなかったりスクショがブラウザだけでなくタスクバーまで入ったりといろいろ問題がある
//automateの場合バックエンドがselenium serverになるのでそのあたりの不具合を踏みやすい
e2eEnv.BROWSERSTACK_USE_AUTOMATE = "1";
e2eEnv.BROWSERSTACK_LOCAL_IDENTIFIER = "TestCafe";

//ログを全て取得する
//詳細は以下を参照
//https://github.com/DevExpress/testcafe-browser-provider-browserstack#other-browserstack-options
//https://www.browserstack.com/automate/capabilities
e2eEnv.BROWSERSTACK_CONSOLE = "verbose";
e2eEnv.BROWSERSTACK_NETWORK_LOGS = "true";

e2eEnv.BASE_URL = baseUrl;
e2eEnv.E2E_LANGUAGE = language;

const mergedEnv = Object.assign(process.env, e2eEnv);

function main() {
  cp.execSync(
    `yarn cross-env yarn testcafe '${browser}' ./e2e/*.ts`,
    {
      env: mergedEnv,
      stdio: "inherit",
    }
  );
}

main();
