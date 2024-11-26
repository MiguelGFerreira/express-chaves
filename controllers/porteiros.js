import sql from 'mssql';

export const getPorteirosAtivos = (req, res) => {

	let query = `SELECT ID, PORTEIRO FROM RKF_CHAVES_PORTEIRO WHERE ATIVO = 'S'`

	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.send(result.recordset); // Send query result as response
		}
	});
}