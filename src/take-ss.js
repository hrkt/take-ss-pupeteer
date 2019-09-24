#!/usr/bin/env node
'use strict'
const puppeteer = require('puppeteer')
const program = require('commander')
const logger = setupLog()

function setupLog() {
    const log4js = require('log4js')
    log4js.configure('log4js.json')
    return log4js.getLogger()
}

function parseArgs() {
    program
        .version('0.1.0', '-v, --version')
        .option(
            '-vw, --viewport-width <int>',
            'Viewport(width) of the screenshot',
            1200
        )
        .option(
            '-vh, --viewport-height <int>',
            'Viewport(height) of the screenshot',
            800
        )
        .option(
            '-o, --output-filename <filename>',
            'filename of the screenshot',
            'out.png'
        )
        .option(
            '-j, --output-as-json',
            'output result as JSON, base64 encoded image and meta data',
            false
        )
        .parse(process.argv)
}

async function invokePupeteer(params) {
    const encodingType = params.outputAsJson ? 'base64' : 'binary'
    logger.debug('encodingType %s', encodingType)
    logger.info(
        'URL: %s %d x %d as %s in %s',
        params.targetUrl,
        params.pageWidth,
        params.pageHeight,
        params.filename,
        encodingType
    )
    var browser
    try {
        browser = await puppeteer.launch({
            executablePath: process.env.CHROME_BIN || null,
            args: ['--no-sandbox', '--headless', '--disable-gpu', '--disable-dev-shm-usage']
        })
        const page = await browser.newPage()

        page.setViewport({
            width: params.pageWidth,
            height: params.pageHeight,
        })
        //await page.goto(params.targetUrl, { waitUntil: 'networkidle2' })
        await page.goto(params.targetUrl, { waitUntil: 'domcontentloaded' })
        let description = ''
        try {
            description = await page.$eval(
                'head > meta[name="description"]',
                element => element.content
            )
        } catch (error) {
            logger.info(error)
        }
        let title = ''
        try {
            title = await page.title()
        } catch (error) {
            logger.info(error)
        }
        logger.debug('%s %s', title, description)
        const result = await page.screenshot({
            path: params.filename,
            fullPage: params.fullPage,
            ignoreHTTPSErrors: false,
            encoding: encodingType,
        })
        if (params.outputAsJson) {
            logger.debug(
                'length of base64: %d, description = %s',
                result.length,
                description
            )
            return {
                base64Img: result,
                description: description,
                title: title,
            }
        } else {
            return
        }
    } catch (error) {
        logger.error(error)
        throw new Error('could not execute capturing')
    } finally {
        await browser.close()
    }
}

function main() {
    const startTimeMs = new Date().getTime()
    parseArgs()
    if (process.argv.length < 3) {
        process.exit(1)
    }
    let params = {}
    params.targetUrl = process.argv[process.argv.length - 1]
    params.pageWidth = program.viewportWidth
    params.pageHeight = program.viewportHeight
    params.filename = program.outputAsJson ? null : program.outputFilename
    params.fullPage = false
    params.outputAsJson = program.outputAsJson
    if(process.env.TAKE_SS_SERVERSIDE_MODE) {
        params.filename = null
        params.outputAsJson = true
    }
    ;(async () => {
        try {
            const result = await invokePupeteer(params)
            if (params.outputAsJson) {
                // use this 'base64str' string with
                // <img src="data:image/png;base64,${base64str}">
                console.log(JSON.stringify(result).toString('utf8'))
            } else {
                console.log('output:%s', params.filename)
            }
            const endTimeMs = new Date().getTime()
            const elapsedTimeMs = endTimeMs - startTimeMs
            logger.info(
                'Execution time: %d for %s',
                elapsedTimeMs,
                params.targetUrl
            )
        } catch (error) {
            logger.error(error)
            console.error('An error occured. - ' + error)
            process.exit(1)
        }
    })()
}

main()
