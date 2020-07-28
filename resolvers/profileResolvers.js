const {
  existsSync,
  mkdirSync,
  createWriteStream,
  unlink,
  readdir,
} = require("fs");
const isAuth = require("../middleware/isAuth");
const Profile = require("../models/Profile");
const { ApolloError } = require("apollo-server-express");
const User = require("../models/User");
const path = require("path");

const deleteFromFolder = (id) => {
  const dir = "uploads";
  readdir(dir, (err, files) => {
    if (err) {
      throw new ApolloError(err.message);
    }
    files.find((file) => {
      if (file.split(".")[0] === id) {
        unlink(path.join(dir, file), (err) => {
          if (err) throw err.message;
        });
      }
    });
  });
};
const insertInFolder = async (filename, createReadStream, profile) => {
  const ext = filename.split(".").pop();
  const path = `uploads/${profile.id}.${ext}`;
  profile.filename = filename;
  await profile.save();
  return new Promise((resolve, reject) => {
    createReadStream()
      .pipe(createWriteStream(path))
      .on("finish", async () => {
        resolve(profile);
      })
      .on("error", () => {
        reject();
      });
  });
};
module.exports = {
  Query: {
    profiles: async () => {
      const profiles = await Profile.find().populate("user");
      return profiles;
    },
    profile: async (_, { id }) => {
      return await Profile.findById(id).populate("user");
    },
  },
  Mutation: {
    createProfile: async (_, { file }, { req }) => {
      const { id } = isAuth(req);
      const { createReadStream, filename, mimetype } = await file;
      if (!mimetype.startsWith("image/")) {
        throw new ApolloError("Only images allowed to upload", 405);
      }
      if (!existsSync("./uploads/")) {
        mkdirSync("./uploads");
      }
      const existingProfile = await Profile.findOne({ user: id });
      if (existingProfile) {
        throw new ApolloError("Profile for this user already exists", 405);
      }
      const user = await User.findById(id);
      const profile = new Profile({ filename, user });
      await profile.save();
      user.profile = profile._id;
      await user.save();
      return await insertInFolder(filename, createReadStream, profile);
    },
    deleteProfile: async (_, { id }, { req }) => {
      const res = isAuth(req);
      const profile = await Profile.findById(id);
      if (!profile) throw new ApolloError("Profile not found", 404);
      if (profile.user != res.id) {
        throw new ApolloError("You cannot delete other's profile", 405);
      }
      try {
        deleteFromFolder(id);
        await Profile.findByIdAndRemove(id);
        const user = await User.findById(res.id);
        user.profile = undefined;
        await user.save();
        return "Profile successfully deleted";
      } catch (e) {
        throw new ApolloError(e.message, 500);
      }
    },
    updateProfile: async (_, { file, id }, { req }) => {
      const profile = await Profile.findById(id).populate("user");
      if (!profile) throw new ApolloError("Profile not found", 404);
      const res = isAuth(req);
      if (profile.user.id != res.id) {
        throw new ApolloError("You cannot update someone else's profile", 405);
      }
      const { createReadStream, filename, mimetype } = await file;
      if (profile.filename === filename) {
        throw new ApolloError(
          "Profile with this file name already existis",
          500
        );
      }
      if (!mimetype.startsWith("image/")) {
        throw new ApolloError("Only images allowed to upload", 405);
      }
      deleteFromFolder(id);
      return await insertInFolder(filename, createReadStream, profile);
    },
  },
};
