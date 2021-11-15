# 123 Shopping Mall

# 測試帳號
## 前台
帳號:user2@example.com
密碼:12345678

## 後台
帳號:user1@example.com
密碼:12345678

# README

## 安裝步驟
1. 使用終端機，clone此專案到local位置


        git clone https://github.com/kyle5408/cart-gold-flow.git
2. 使用終端機，進入此專案所在的資料夾


        cd 資料夾路徑

3. 安裝套件


        npm install
4. 安裝MySQL並按照config.json新增development用DB


        cart-gold-flow
5. 透過Sequelize cli建立table


        npx sequelize db:migrate

6. 透過Sequelize migration指令建立種子資料


        npx sequelize db:seed:all

7. 參照.env.example檔案建立.env檔案並設定環境參數

8. 建立遠端分支

        git checkout -b master
9. 啟動伺服器



        npm run dev
10. 看到以下字樣代表成功啟動並監聽server


        Example app listening on http://localhost:3000
        
## 金流測試
1. 從訂單進入付款頁面後輸入測試卡號


        4000-2211-1111-1111 安全碼及到期日(需晚於當日)任選
2. 可於註冊信箱確認通知信
