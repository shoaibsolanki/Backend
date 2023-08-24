const RoleBase = (...roles) => {
    return (req, res, next) => {
        console.log(req.role)
        if (!roles.includes(req.role)) {
            return next(
                res.send("only admin allow")
            )
        }
        next()
    }
}

module.exports = RoleBase