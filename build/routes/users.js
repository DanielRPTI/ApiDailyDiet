"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/routes/users.ts
var users_exports = {};
__export(users_exports, {
  userRoute: () => userRoute
});
module.exports = __toCommonJS(users_exports);

// src/database.ts
var import_knex = require("knex");

// src/env/index.ts
var import_dotenv = require("dotenv");
var import_zod = require("zod");
if (process.env.NODE_ENV === "test") {
  (0, import_dotenv.config)({ path: ".env.test" });
} else {
  (0, import_dotenv.config)();
}
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["development", "test", "production"]).default("production"),
  DATABASE_CLIENT: import_zod.z.enum(["sqlite", "pg"]),
  DATABASE_URL: import_zod.z.string(),
  PORT: import_zod.z.coerce.number().default(3e3)
});
var _env = envSchema.safeParse(process.env);
if (!_env.success) {
  console.error("Invalid environment variables!", _env.error.format());
  throw new Error("\u26A0\uFE0F Invalid env variables");
}
var env = _env.data;

// src/database.ts
var config2 = {
  client: env.DATABASE_CLIENT,
  connection: {
    filename: env.DATABASE_URL
  },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./db/migrations"
  }
};
var knex = (0, import_knex.knex)(config2);

// src/routes/users.ts
var import_zod2 = require("zod");
var import_node_crypto = require("crypto");
function userRoute(app) {
  return __async(this, null, function* () {
    app.get("/", () => __async(this, null, function* () {
      const users = yield knex("users").select();
      return { users };
    }));
    app.post("/", (request, reply) => __async(this, null, function* () {
      const creatUserBodySchema = import_zod2.z.object({
        username: import_zod2.z.string(),
        age: import_zod2.z.number()
      });
      const { username, age } = creatUserBodySchema.parse(request.body);
      const userId = (0, import_node_crypto.randomUUID)();
      reply.cookie("userId", userId, {
        path: "/",
        maxAge: 1e3 * 60 * 60 * 24 * 1
        // 1 day to expire
      });
      yield knex("users").insert({
        id: userId,
        username,
        age
      });
      return reply.status(201).send();
    }));
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  userRoute
});
