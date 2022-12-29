exports = module.exports = exports = module.exports = function() {
  var mod = {
    getByKey: async function(key) {
      var {user, error} = await app.api.mysql.request("user", function(data) {}, `
        SELECT
          *
        FROM \`user\`
        WHERE
          \`key\`=` + app.api.mysql.escape(key) + `
      `);
      return user;
    },
    getByKeyAndToken: async function(key, token) {
      var {user, error} = await app.api.mysql.request("user", function(data) {}, `
        SELECT
          *
        FROM \`user\`
        WHERE
          \`key\`=` + app.api.mysql.escape(key) + `
          AND \`token\`=` + app.api.mysql.escape(token) + `
      `);
      return user;
    },
    getByEmail: async function(email) {
      var {user, error} = await app.api.mysql.request("user", function(data) {}, `
        SELECT
          *
        FROM \`user\`
        WHERE
          \`email\`=` + app.api.mysql.escape(email) + `
      `);
      return user;
    },
    list: async function() {
      var {users, error} = await app.api.mysql.request("users", function(data) {}, `
        SELECT
          *
        FROM \`user\`
      `, "list");
      return users;
    },
    save: async function(user, newUser) {
      if (!app.has(newUser)) newUser = false;
      if (!app.has(user.userId) && !newUser) return false;
      var query = "";
      for (var i=0; i<=app.config.mysql.table.user.fields.length-1; i++) {
        var key = app.config.mysql.table.user.fields[i];
        if (key !== "userId") {
          if (app.has(user[key])) {
            if (app.has(query)) query += ", ";
            query += `\`` + key + `\`=` + app.api.mysql.escape(user[key]);
          }
        }
      }
      if (!app.has(query)) return false;
      if (!newUser) {
        var {data, error} = await app.api.mysql.request("data", function(data) {}, `
          UPDATE \`user\`
          SET
            ` + query + `
          WHERE
            \`userId\`=` + user.userId + `
        `);
      } else {
        var {data, error} = await app.api.mysql.request("data", function(data) {}, `
          INSERT INTO \`user\`
          SET
            ` + query + `
        `);
      }
      if (!app.has(error)) return true;
      return false;
    }
  };
  return mod;
}