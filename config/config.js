require('dotenv').config();

module.exports = {
    development: {
        myConfig: {
            sessionSecret: "P@ssw0rd#123S1f1gT0k3n",
            refreshSessionSecret: "P@ssw0rd#123S1f1gT0k3n",
            expiredSessionTime: "24h",
            expiredRefreshSessionTime: "24h",
            api_gateway_url: 'https://192.168.42.234:8443/',
            api_gateway_admin: 'https://192.168.42.234:8444/',
            cloud_url: 'http://103.124.115.141:3010/'
        }
    },
    test: {
        myConfig: {
            sessionSecret: "P@ssw0rd#123S1f1gT0k3n",
            refreshSessionSecret: "P@ssw0rd#123S1f1gT0k3n",
            expiredSessionTime: "2h",
            expiredRefreshSessionTime: "3h",
            api_gateway_url: 'https://192.168.42.234:8443/',
            api_gateway_admin: 'https://192.168.42.234:8444/',
            cloud_url: 'http://103.124.115.141:3010/'
        }
    },
    production: {
        myConfig: {
            sessionSecret: "P@ssw0rd#123S1f1gT0k3n",
            refreshSessionSecret: "P@ssw0rd#123S1f1gT0k3n",
            expiredSessionTime: "2h",
            expiredRefreshSessionTime: "3h",
            api_gateway_url: 'https://localhost:7443/',
            api_gateway_admin: 'https://localhost:7444/',
            cloud_url: 'http://103.124.115.141:3010/'
        }
    }
}   