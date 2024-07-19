const express = require('express');
const oracledb = require('oracledb');
const app = express();

const dbConfig = {
  user: 'hr',
  password: 'hr#2024',
  connectString: '172.16.0.82:1522/PDB21C',
};

async function getStudents(req, res) {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);
    
    const result = await connection.execute(
      `SELECT student_id,f_name,l_name,class_year,room, 
      case
      when gender = 'F' then 'หญิง'
      when gender = 'M' then 'ชาย'
      end as gender
      FROM STUDENT`
    );

    const rows = result.rows.map(row => {
      return {
        student_id: row[0],
        first_name: row[1],
        last_name: row[2],
        class_year: row[3],
        room: row[4],
        gender: row[5]
      };
    });
 
    res.json(rows);

  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({ error: 'Error executing query' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

app.get('/students', getStudents);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
