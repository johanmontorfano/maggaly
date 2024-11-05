import { Response } from "express";

export default function(_: any, res: Response) {
    res.send(`
<!DOCTYPE HTML>
<head>
    <title>Virtual Network</title>
</head>
<body>
    <script src="/viewer_hydration.js"></script>
</body>
    `);
}
