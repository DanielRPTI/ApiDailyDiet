"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
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

// src/app.ts
var app_exports = {};
__export(app_exports, {
  app: () => app
});
module.exports = __toCommonJS(app_exports);
var import_fastify = __toESM(require("fastify"));
var import_cookie = __toESM(require("@fastify/cookie"));

// src/routes/dailyDiet.ts
var import_zod2 = require("zod");

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
  connection: env.DATABASE_CLIENT === "sqlite" ? {
    filename: env.DATABASE_URL
  } : env.DATABASE_URL,
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./db/migrations"
  }
};
var knex = (0, import_knex.knex)(config2);

// src/middlewares/check-user-id.ts
function checkUserId(request, reply) {
  return __async(this, null, function* () {
    const userId = request.cookies.userId;
    if (!userId) {
      return reply.status(401).send({
        error: "Unauthorized"
      });
    }
  });
}

// src/routes/dailyDiet.ts
var import_crypto = require("crypto");
function dailyDietRoutes(app2) {
  return __async(this, null, function* () {
    app2.addHook("preHandler", checkUserId);
    app2.get("/", (request, reply) => __async(this, null, function* () {
      const { userId } = request.cookies;
      const meals = yield knex("meals").where("user_id", userId).select("*");
      if (meals.indexOf(0)) {
        return reply.status(400).send({
          message: "You dont have any meal created, try to insert something!"
        });
      }
      return {
        meals
      };
    }));
    app2.get("/:id", (request, reply) => __async(this, null, function* () {
      const { userId } = request.cookies;
      const getMealParamsSchema = import_zod2.z.object({
        id: import_zod2.z.string().uuid()
      });
      const { id } = getMealParamsSchema.parse(request.params);
      const meal = yield knex("meals").where({
        user_id: userId,
        id
      }).first();
      return {
        meal
      };
    }));
    app2.get("/metrics", (request, reply) => __async(this, null, function* () {
      const { userId } = request.cookies;
      const listMeals = yield knex("meals").where("user_id", userId);
      const mealsWithinDiet = yield knex("meals").where({
        user_id: userId,
        within_diet: true
      });
      const theBestSequenceDiet = yield knex("meals").where({
        user_id: userId,
        within_diet: true
      }).orderBy("consumed_at", "desc");
      return {
        TotalofMeals: listMeals.length,
        InDietMeals: mealsWithinDiet.length,
        OutOfDietMeals: listMeals.length - mealsWithinDiet.length,
        BestSequence: theBestSequenceDiet
      };
    }));
    app2.post("/", (request, reply) => __async(this, null, function* () {
      const { userId } = request.cookies;
      const creatMealBodySchema = import_zod2.z.object({
        name: import_zod2.z.string(),
        description: import_zod2.z.string(),
        within_diet: import_zod2.z.boolean(),
        consumed_at: import_zod2.z.string()
      });
      const { name, description, within_diet, consumed_at } = creatMealBodySchema.parse(request.body);
      yield knex("meals").insert({
        id: (0, import_crypto.randomUUID)(),
        name,
        description,
        within_diet,
        user_id: userId,
        consumed_at
      });
      return reply.status(201).send();
    }));
    app2.put("/:id", (request, reply) => __async(this, null, function* () {
      const { userId } = request.cookies;
      const getMealParamsSchema = import_zod2.z.object({
        id: import_zod2.z.string().uuid()
      });
      const { id } = getMealParamsSchema.parse(request.params);
      const updateMealRequest = import_zod2.z.object({
        name: import_zod2.z.string(),
        description: import_zod2.z.string(),
        within_diet: import_zod2.z.boolean(),
        consumed_at: import_zod2.z.string()
      });
      const { name, description, within_diet, consumed_at } = updateMealRequest.parse(request.body);
      const updateMeal = yield knex("meals").where({
        user_id: userId,
        id
      }).update({
        name,
        description,
        within_diet,
        consumed_at
      });
      if (updateMeal === 0) {
        return reply.status(400).send({
          message: "Nothing is updated, please try with another id or another value to updated"
        });
      }
      return reply.status(204).send({ message: "Update succsseful" });
    }));
    app2.delete("/:id", (request, reply) => __async(this, null, function* () {
      const { userId } = request.cookies;
      const getMealParamsSchema = import_zod2.z.object({
        id: import_zod2.z.string().uuid()
      });
      const { id } = getMealParamsSchema.parse(request.params);
      const deleteMeal = yield knex("meals").where({
        user_id: userId,
        id
      }).del();
      if (deleteMeal === 0) {
        return reply.status(400).send({
          message: "Nothing has been deleted, please try with another id or another value to deleted"
        });
      }
      return reply.status(202).send({
        message: "Meal  has been deleted"
      });
    }));
  });
}

// src/routes/users.ts
var import_zod3 = require("zod");
var import_node_crypto = require("crypto");
function userRoute(app2) {
  return __async(this, null, function* () {
    app2.get("/", () => __async(this, null, function* () {
      const users = yield knex("users").select();
      return { users };
    }));
    app2.post("/", (request, reply) => __async(this, null, function* () {
      const creatUserBodySchema = import_zod3.z.object({
        username: import_zod3.z.string(),
        age: import_zod3.z.number()
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

// src/app.ts
var app = (0, import_fastify.default)();
app.register(import_cookie.default);
app.register(userRoute, {
  prefix: "/users"
});
app.register(dailyDietRoutes, {
  prefix: "/meals"
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  app
});
