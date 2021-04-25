db.createUser({
  user: "meanuser",
  pwd: "Aa123456.",
  roles: [
    {
      role: "readWrite",
      db: "mean-demo-db",
    },
  ],
})
