const path      = require('path');
const express   = require('express');
const Pocket    = require('pocket-cms');

const cms = new Pocket();
const app = express();

app.use('/cms', cms.middleware());

app.listen(8000, async () => {
  console.log('--> Server is running on port 8000');
  console.log('--> Access the CMS admin panel through http://localhost:8000/cms/admin');

  const users = await cms.resource('_users').find({});
  if (users.length === 0) {
    console.log('-----> Creating first admin user');

    await cms.users.create('localAdmin', 'localAdmin', [ 'admins' ]);

    console.log('-----> User localAdmin:localAdmin created');
    console.log('-----> Password should be changed ASAP');
  }

  if (process.env.PARCEL_DEV === "true") {
    const Bundler     = require('parcel-bundler');
    const entryFile   = path.join(__dirname, 'webapp/index.html');
    const outDir      = path.join(__dirname, 'dist');
    const bundler     = new Bundler(entryFile, { outDir });

    app.use('/', bundler.middleware());
  } else {
    app.use('/', express.static(path.join(__dirname, 'dist')));
  }

});