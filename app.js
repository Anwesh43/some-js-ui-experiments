const {Builder, By} = require('selenium-webdriver')
const childProcess = require('child_process')
const serverProcess = childProcess.spawn('python', ['-m', 'http.server'], {stdio : 'pipe'})
var errorInStartingServer = false
if (process.argv.length == 3) {

    const toTest = process.argv[2]

    async function openPage() {
        let driver = await new Builder().forBrowser("chrome").build()
        try {
            await driver.get('http://localhost:8000/')
            // const evalFn = `const script = document.createElement('script');
            //   script.src = ${toTest}.js;
            //   document.body.appendChild(script)
            //   script.onload = () => {
            //     const btn = document.createElement('button')
            //     btn.innerHTML = ${toTest}
            //     btn.id = ${toTest}
            //     btn.onclick = () => {
            //       ${toTest}.init();
            //     }
            //     document.body.appendChild(btn)
            //   }`
            //   const awaitEsFn = `await driver.executeScript(() => {
            //     ${evalFn}
            //   })`
            //   const asyncESFn = `async function esCall(){${awaitEsFn}}; esCall();`
            //   eval(asyncESFn)
              await driver.executeScript(() => { function createScript(toTest) {
                const script = document.createElement('script');
                script.src = `${toTest}.js`;
                document.body.appendChild(script);
                script.onload = () => {
                    const btn = document.createElement('button');
                    btn.innerHTML = toTest;
                    btn.id = toTest;
                    btn.onclick = () => {;
                      eval(`${toTest}.init()`);
                    }
                    document.body.appendChild(btn)
                }
          }
          createScript(arguments[0])
        }, toTest)
          await driver.sleep(2000)
          await driver.findElement(By.id(toTest)).click()
          await driver.sleep(1000)
          for (var i = 0; i < 20; i++) {
            await driver.findElement(By.js(() => document.getElementsByTagName('canvas')[0])).click()
            await driver.sleep(1000)
          }
        } finally {
          await driver.quit()
        }

    }
    async function start() {
      await openPage()
      serverProcess.kill()
    }
    setTimeout(() => {
        if (!errorInStartingServer) {
            if (toTest) {
                start()
            }
        }
    }, 2000)
  }

  else {
      serverProcess.kill()
  }

  serverProcess.stdout.on('data', (data) => {
    console.log(data.toString())
  })

  serverProcess.on('error', () => {
    errorInStartingServer = true
    serverProcess.kill()
  })
