const crypto = require("crypto")
const URL = process.env.URL
const MerchantID = process.env.MERCHANT_ID
const HashKey = process.env.HASH_KEY
const HashIV = process.env.HASH_IV
const PayGateWay = "https://ccore.newebpay.com/MPG/mpg_gateway"
const ReturnURL = URL + "/newebay/callback?from=ReturnURL"
const NotifyURL = URL + "/newebay/callback?from=NotifyURL"
const ClientBackURL = URL + "/orders"

const payment = {
  //交易資料轉換成字串
  genDataChain: (TradeInfo) => {
    let results = []
    for (let kv of Object.entries(TradeInfo)) {
      results.push(`${kv[0]}=${kv[1]}`)
    }
    return results.join('&')
  },

  //交易資料與HashKey資料組合AES加密
  create_mpg_aes_encrypt: (TradeInfo) => {
    let encrypt = crypto.createCipheriv("aes256", HashKey, HashIV);
    let enc = encrypt.update(payment.genDataChain(TradeInfo), "utf8", "hex");
    return enc + encrypt.final("hex");
  },

  //交易資料AES解密
  create_mpg_aes_decrypt: (TradeInfo) => {
    let decrypt = crypto.createDecipheriv("aes256", HashKey, HashIV);
    decrypt.setAutoPadding(false);
    let text = decrypt.update(TradeInfo, "hex", "utf8");
    let plainText = text + decrypt.final("utf8");
    let result = plainText.replace(/[\x00-\x20]+/g, "");
    return result;
  },


  //資料雜湊(轉大寫符合API需求)
  create_mpg_sha_encrypt: (TradeInfo) => {
    let sha = crypto.createHash("sha256");
    let plainText = `HashKey=${HashKey}&${TradeInfo}&HashIV=${HashIV}`
    return sha.update(plainText).digest("hex").toUpperCase();
  },

  //取得交易資料
  getTradeInfo: (Amt, Desc, email) => {
    data = {
      'MerchantID': MerchantID, // 商店代號
      'RespondType': 'JSON', // 回傳格式
      'TimeStamp': Date.now(), // 時間戳記
      'Version': 1.5, // 串接程式版本
      'MerchantOrderNo': Date.now(), // 商店訂單編號
      'LoginType': 0, // 智付通會員
      'OrderComment': 'OrderComment', // 商店備註
      'Amt': Amt, // 訂單金額
      'ItemDesc': Desc, // 產品名稱
      'Email': email, // 付款人電子信箱
      'ReturnURL': ReturnURL, // 支付完成返回商店網址
      'NotifyURL': NotifyURL, // 支付通知網址/每期授權結果通知
      'ClientBackURL': ClientBackURL, // 支付取消返回商店網址
    }

    mpg_aes_encrypt = payment.create_mpg_aes_encrypt(data)
    mpg_sha_encrypt = payment.create_mpg_sha_encrypt(mpg_aes_encrypt)

    tradeInfo = {
      'MerchantID': MerchantID, // 商店代號
      'TradeInfo': mpg_aes_encrypt, // 加密後參數
      'TradeSha': mpg_sha_encrypt,
      'Version': 1.5, // 串接程式版本
      'PayGateWay': PayGateWay,
      'MerchantOrderNo': data.MerchantOrderNo,
    }

    return tradeInfo
  }
}

module.exports = payment