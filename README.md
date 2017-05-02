# Wifidog-node-mongodb-auth-server
The complete auth server is written in Node.js and MongoDb which follows all the protocols of WifiDog auth server. 

#Features
1. Login page to access wifi.
2. Splash page if already logged in. 
3. Per day data limit for every user. 
4. Notifiy user via SMS if data limit reached.

#To be done

1. Analytics UI to analyse data consumption. ( Currently all data consumed by a user is stored via mongodb in sessions which can be used to identify the total data consumed, day wise consumption, etc)
2. Time limit per day. 


#Usage
1. npm install
2. node server/server.js
