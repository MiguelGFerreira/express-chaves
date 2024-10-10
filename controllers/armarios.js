import sql from 'mssql';

export const getArmarios = (req, res) => {
	let query = 'SELECT ID, Numero, Genero, Nome, STATUS FROM RKF_ARMARIOS';

	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.send(result.recordset); // Send query result as response
		}
	});
}

export const getArmariosDet = (req, res) => {
	let query = 'SELECT ID, Numero, Genero, DataEntrega, Nome, Matricula, Setor, Funcao, SuperiorImediato, DataDevolucao, STATUS FROM RKF_ARMARIOS';

	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.send(result.recordset); // Send query result as response
		}
	});
}

export const patchArmario = (req, res) => {
	const { dataEntrega, dataDevolucao, nome, matricula, setor, funcao, superior, status } = req.body;
	let dataField = '';

	if (dataEntrega) {
		dataField = `DataEntrega = '${dataEntrega}'`
	}
	if (dataDevolucao) {
		dataField = `DataDevolucao = '${dataDevolucao}'`
	}

	let query = `
		UPDATE RKF_ARMARIOS SET
		${dataField},
		Nome = '${nome}',
		Matricula = '${matricula}',
		Setor = '${setor}',
		Funcao = '${funcao}',
		SuperiorImediato = '${superior}',
		STATUS = '${status}'
		WHERE ID = ${req.params.id}
	`

	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.send(result.recordset); // Send query result as response
		}
	});
}