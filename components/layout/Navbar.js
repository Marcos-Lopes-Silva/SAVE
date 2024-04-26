import Link from 'next/link';
import styles from './Navbar.module.css';
import { signOut, useSession } from 'next-auth/react';
import { FaBell, FaSignOutAlt } from 'react-icons/fa';
import Rotas from './Rotas';

const RotasUser = [
    {
        nome: 'Login',
        path: '/login'
    },
]

const Navbar = () => {
    const { data: session } = useSession();



    return (
        <nav className={styles.nav}>
            <h1 className={styles.logo}>SAVE</h1>
            <div className={styles.divideritems}>
                <ul className={styles.items}>
                    {session && session.user.role === 'admin' ? Rotas.filter((item) => item.admin).map(rota => (
                        <li className={styles.item} key={rota.path}>
                            <Link href={rota.path}>
                                <a className={styles.label}>{rota.nome}</a>
                            </Link>
                        </li>
                    ))
                        :
                        Rotas.filter((item) => !item.admin).map(rota => (
                            <li className={styles.item} key={rota.path}>
                                <Link href={rota.path}>
                                    <a className={styles.label}>{rota.nome}</a>
                                </Link>
                            </li>
                        ))
                    }
                </ul>
            </div>

            <div className={styles.posregister}>
                <ul className={styles.registeritems}>
                    {session ?
                        <>
                            <li className={styles.registeritem}>
                                <button className={styles.notificacao}><FaBell fontSize={27} /></button>
                            </li>
                            <li className={styles.registeritem}>
                                <button className={styles.sair} onClick={() => signOut()}><FaSignOutAlt fontSize={27} /></button>
                            </li>
                        </>
                        : 
                            <li className={styles.registeritem}>
                                <Link href={'/login'}>
                                    <button className={styles.login}><a className={styles.blacklabel}>Login</a></button>
                                </Link>
                            </li>
                    }
                </ul>
            </div>
        </nav>
    )
}

export default Navbar;