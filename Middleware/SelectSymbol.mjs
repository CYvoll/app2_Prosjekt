
const symbolsAllowed = ["rock", "paper", "scissors"];

export default function validateSymbol(req, res, next) {
    const symbol = req.body.symbol;

    if (!symbolsAllowed.includes(symbol)) {
        res.status(400);
        res.send("This symbol is not valid!");
        return;
    }
    next();
}