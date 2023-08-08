const fs = require("fs");
const path = require("path");

const AddressVnController = {
    getAllProvinces: async (req, res) => {
        const filePath = path.join(
            __dirname,
            "..",
            "address_api",
            "province.json"
        );
        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                res.status(500).json({ error: "Error reading file" });
            } else {
                res.status(200).json(JSON.parse(data));
            }
        });
    },
    getAllDistrict: async (req, res) => {
        const { idProvince } = req.params;
        const filePath = path.join(
            __dirname,
            "..",
            "address_api",
            "district.json"
        );
        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                res.status(500).json({ error: "Error reading file" });
            } else {
                res.status(200).json(
                    idProvince
                        ? JSON.parse(data).filter(
                              (item) => item.province_uid === idProvince
                          )
                        : JSON.parse(data)
                );
            }
        });
    },
    getDetailDistrict: async (req, res) => {
        const { idDistrict } = req.params;
        const filePath = path.join(
            __dirname,
            "..",
            "address_api/district",
            `${idDistrict}.json`
        );
        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                res.status(500).json({ error: "Error reading file" });
            } else {
                res.status(200).json(JSON.parse(data));
            }
        });
    },
};

module.exports = AddressVnController;
