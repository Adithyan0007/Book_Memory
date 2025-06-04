import jwt from "jsonwebtoken";
function verifyToken(req, res, next) {
  const SECRET_KEY = "Adithyan";
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Unauthorized" });
  const user = jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Token invalid" });
    req.user = user;
    console.log("ss", req.user);

    next();
  });
}
export default verifyToken;
