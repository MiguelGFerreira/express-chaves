import sql from 'mssql';

export const getArmarios = (req, res) => {
	let query = 'SELECT ID, Numero, Genero, STATUS FROM RKF_ARMARIOS';

	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.send(result.recordset); // Send query result as response
		}
	});
}