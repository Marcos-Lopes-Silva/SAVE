import { useMemo, useState } from "react";
import styles from "./Itens.module.css";
import Item from "./Item";
import Pagination from "../Pagination/Pagination";




export default function Itens({ busca, filtro, data }) {

    const [currentPage, setCurrentPage] = useState(1);

    function testaBusca(title) {
        if (busca === '') return true;
        const regex = new RegExp(busca, 'i');
        return regex.test(title);
    }

    function testaFiltro(id) {
        if (filtro !== null) return filtro === id;
        return true;
    }

    const listaFiltrada = useMemo(() => {
        return data.filter((item) => testaBusca(item.title) && testaFiltro(item.status));
    })

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return listaFiltrada.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, listaFiltrada]);

    return (
        <div className={styles.itens}>
            {currentTableData.map((item) => (
                <Item
                    key={item._id}
                    id={item._id}
                    title={item.title}
                    total={item.total}
                    status={item.status}
                    answers={item.respondentes}
                    editionDate={item.editionDate}
                    openDate={item.openDate}
                    endDate={item.endDate}
                />
            ))}
            <div className={styles.paginacao}>
                <Pagination
                    currentPage={currentPage}
                    totalCount={data.length}
                    pageSize={PageSize}
                    onPageChange={page => setCurrentPage(page)}
                />
            </div>
        </div>
    )
}

const PageSize = 4;