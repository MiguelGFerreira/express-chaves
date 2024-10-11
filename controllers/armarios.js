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

export const getMovimentacoes = (req, res) => {

	let query = `
	SELECT M.ID
		,A.Numero
		,A.Genero
		,M.Matricula
		,TRIM(SRA.RA_NOME) Nome
		,DataMovimentacao
		,TipoMovimentacao
	FROM RKF_ARMARIOS_MOVIMENTACOES M
	INNER JOIN RKF_ARMARIOS A ON M.IDArmario = A.ID
	LEFT JOIN FOLHA12..SRA010 SRA ON (SRA.RA_MAT = M.Matricula AND SRA.D_E_L_E_T_ = '')
	`

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
	let insertMovimentacao = '';

	if (dataEntrega) {
		dataField = `DataEntrega = '${dataEntrega}'`
		insertMovimentacao = `INSERT INTO RKF_ARMARIOS_MOVIMENTACOES VALUES (${req.params.id}, '${matricula}', '${dataEntrega}', 'Empréstimo')`
	}
	if (dataDevolucao) {
		dataField = `DataDevolucao = '${dataDevolucao}'`
		insertMovimentacao = `INSERT INTO RKF_ARMARIOS_MOVIMENTACOES VALUES (${req.params.id}, '${matricula}', '${dataDevolucao}', 'Devolução')`
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
		WHERE ID = ${req.params.id};

		${insertMovimentacao}
	`

	console.log(query);

	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.send(result.recordset); // Send query result as response
		}
	});
}