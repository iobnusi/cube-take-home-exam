// seeder file

// to iterate through all xslx files in the data folder and
// batch rows into chunks of 500
// clean up the data
// generate sql insert statement with the data
// use pg to execute the insert statement
// iterate through all chunks and execute the insert statement
// skip and log the data if insert statement fails

// using node-xlsx to read the xslx files
// using pg to execute the insert statement

import fs from "node:fs/promises";
import xlsx from "node-xlsx";
import pg from "pg";
import { columns, cleanRow, isValidRow } from "./utils.js";

const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
});

try {
    await client.connect();
    console.log("\n Connected to database\n");

    const files = await fs.readdir("data");
    console.log(`Found ${files.length} file(s) to process\n`);

    for (const file of files) {
        console.log(`---- ${file} ----`);
        const sheets = xlsx.parse(`data/${file}`);

        for (const sheet of sheets) {
            const totalRows = sheet.data.length - 1;
            const rows = sheet.data.slice(1).map(cleanRow).filter(isValidRow);
            const skipped = totalRows - rows.length;

            console.log(`  Sheet: ${sheet.name}`);
            console.log(
                `    Rows: ${rows.length} valid, ${skipped} skipped (${totalRows} total)`
            );

            // apply chunking
            const chunkSize = 500;
            const chunks = rows.reduce((acc, _, i) => {
                if (i % chunkSize === 0) acc.push(rows.slice(i, i + chunkSize));
                return acc;
            }, []);

            // generate sql insert statement with the data
            for (const [ci, chunk] of chunks.entries()) {
                const sql = `
                  INSERT INTO sales (
                    ${columns.join(", ")}
                  ) VALUES ${chunk
                      .map(
                          (_, rowIndex) =>
                              `(${columns
                                  .map(
                                      (_, index) =>
                                          `$${
                                              rowIndex * columns.length +
                                              index +
                                              1
                                          }`
                                  )
                                  .join(", ")})`
                      )
                      .join(",")}
                `;

                await client.query(sql, chunk.flat());
                console.log(
                    `    Inserted chunk ${ci + 1}/${chunks.length} (${
                        chunk.length
                    } rows)`
                );
            }

            console.log(`   Done — ${rows.length} rows inserted\n`);
        }
    }

    console.log(" Seeding complete\n");
} catch (error) {
    console.error("\n Seeding failed:", error.message);
    console.error(error);
} finally {
    await client.end();
}
