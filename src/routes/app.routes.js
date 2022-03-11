import React, { useContext } from 'react';

import { AuthContext } from '../contexts/auth';

import PaginasProfessor from '../PaginasProfessor';
import PaginasAlunos from '../PaginasAlunos';

function AppRoutes() {

    const { user } = useContext(AuthContext);

    if (user.tipo === 'Aluno') {
        return (
            <PaginasAlunos />
        )
    }
    if (user.tipo === 'Professor') {
        return (
            <PaginasProfessor />
        )
    }
}


export default AppRoutes;