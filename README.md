# graceful-shutdown

#Running application
pm2 [start|restart|stop|delete] ecosystem.config.js

#ecosystem for pm2 
 ```module.exports = {
  apps : [{
    name: 'server',
    script: './index.js',
    kill_timeout: 4000,
    restart_delay: 4000,
    env: {
      NODE_ENV: "development",
    },
  }],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};```

