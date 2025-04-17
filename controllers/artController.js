export const art= async (req, res) => {
    try {
        console.log(req.body);
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "error in art route",

        });
    }
}