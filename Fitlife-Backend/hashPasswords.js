const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "chandu@1602",
    database: "fitlife"
});

async function hashPasswords() {
    try {
        const [users] = await db.query("SELECT user_id, password_hash FROM users");
        for (let user of users) {
            if (!user.password_hash.startsWith("$2a$")) { // If not already hashed
                const hashedPassword = await bcrypt.hash(user.password_hash, 10);
                await db.query("UPDATE users SET password_hash = ? WHERE user_id = ?", [hashedPassword, user.user_id]);
                console.log(`✅ Updated password for user ID: ${user.user_id}`);
            }
        }
        console.log("✅ Password hashing complete.");
    } catch (error) {
        console.error("❌ Error updating passwords:", error);
    } finally {
        process.exit(); // Exit after execution
    }
}

hashPasswords();
