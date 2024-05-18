import { useState } from "react";
import "./style.scss";

export interface TableColumn<T> {
    key: keyof T;
    header: string;
    render?: (item: T) => React.ReactNode;

}

interface TableProps<T> {
    data: T[];
    columns: TableColumn<T>[];
    selectable?: boolean; 
    onSelectionChange?: (selectedItems: T[]) => void; 
}

const Table = <T extends { isin: string | number }>({ data, columns, selectable, onSelectionChange }: TableProps<T>) => {
    const [selected, setSelected] = useState<Set<string | number>>(new Set());

    const toggleSelection = (isin: string | number) => {
        const newSelected = new Set(selected);
        if (newSelected.has(isin)) {
            newSelected.delete(isin);
        } else {
            newSelected.add(isin);
        }
        setSelected(newSelected);
        if (onSelectionChange) {
            onSelectionChange(data.filter(item => newSelected.has(item.isin)));
        }
    };

    const handleCheckboxChange = (isin: string | number) => {
        toggleSelection(isin);
    };
    return (
        <div className="table-conatiner">
            <table className="table">
                <thead>
                    <tr>
                        {selectable && <th></th>}
                        {columns.map(column => <th key={String(column.key)}>{column.header}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={item.isin || index}>
                            {selectable && (
                                <td>
                                    <input
                                        type="checkbox"
                                        aria-label={`${item.isin}-checkbox`}
                                        checked={selected.has(item.isin)}
                                        onChange={() => handleCheckboxChange(item.isin)}
                                    />
                                </td>
                            )}
                            {columns.map(column => (
                                <td key={String(column.key)}>
                                    {column.render ? column.render(item) : (item[column.key] as React.ReactNode)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    )
};

export default Table;