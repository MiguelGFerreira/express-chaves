import sql from 'mssql';

export const getArmarios = (req, res) => {
	let query = 'SELECT ID, Numero, Genero, Nome, STATUS, Empresa FROM RKF_ARMARIOS';

	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.send(result.recordset); // Send query result as response
		}
	});
}

export const getArmariosDet = (req, res) => {
	let query = `
		SELECT A.ID, A.Numero, A.Genero, A.DataEntrega, A.Nome, A.Matricula, A.Setor, A.Funcao, A.SuperiorImediato, A.DataDevolucao, A.STATUS, A.Empresa
		FROM RKF_ARMARIOS A
		`;

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
		,A.Empresa
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

export const getAssinaturaMovimentacao = (req, res) => {

	let query = `
	SELECT ASS.ASSINATURA
	FROM RKF_ARMARIOS_MOVIMENTACOES M
	OUTER APPLY(SELECT ASSINATURA FROM RKF_ASSINATURA A WHERE A.ID = M.IDAssinatura) ASS
	WHERE M.ID = ${req.params.idMov}
	`

	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.contentType('image/png');
			const imageBuffer = result.recordset[0].ASSINATURA;
			res.send(imageBuffer); // Send query result as response
		}
	});

}

export const patchArmario = (req, res) => {
	const { dataEntrega, dataDevolucao, nome, matricula, setor, funcao, superior, status } = req.body;
	let dataField = '';
	let insertMovimentacao = '';

	if (dataEntrega) {
		dataField = `DataEntrega = '${dataEntrega}'`
		insertMovimentacao = `INSERT INTO RKF_ARMARIOS_MOVIMENTACOES (IDArmario, Matricula, DataMovimentacao, TipoMovimentacao) VALUES (${req.params.id}, '${matricula}', '${dataEntrega}', 'Empréstimo')`
	}
	if (dataDevolucao) {
		dataField = `DataDevolucao = '${dataDevolucao}'`
		insertMovimentacao = `INSERT INTO RKF_ARMARIOS_MOVIMENTACOES (IDArmario, Matricula, DataMovimentacao, TipoMovimentacao) VALUES (${req.params.id}, '${matricula}', '${dataDevolucao}', 'Devolução')`
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

export const getAssinaturaArmario = (req, res) => {

	let query = `
	SELECT A.ASSINATURA
	FROM RKF_ARMARIOS_MOVIMENTACOES AM
	INNER JOIN RKF_ASSINATURA A ON AM.IDAssinatura = A.ID
	WHERE TipoMovimentacao = 'Empréstimo'
		AND IDArmario = ${req.params.idArmario}
		AND Matricula = ${req.params.matricula}
	`

	//query = 'SELECT TOP 1 ASSINATURA FROM RKF_ASSINATURA ORDER BY ID DESC'
	//console.log(query);

	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.contentType('image/png');
			const imageBuffer = result.recordset[0].ASSINATURA;
			res.send(imageBuffer); // Send query result as response
		}
	});

}