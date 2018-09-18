const { send } = require('micro')
const { S3 } = require('aws-sdk')
const cors = require('micro-cors')()

const s3 = new S3()

const Bucket = 'aws-primer-20180914'
const Key = 'data.json'

const handler = async (req, res) => {
    const { Body, ContentType } = await s3.getObject({ Bucket, Key }).promise()
    res.setHeader('Content-Type', ContentType)
    return send(res, 200, Body)
}

module.exports = cors(handler)