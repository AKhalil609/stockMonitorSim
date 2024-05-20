import { render, screen, fireEvent } from '@testing-library/react';
import Table, { TableColumn } from './';

interface TestData {
  isin: string;
  name: string;
  price: number;
}

const columns: TableColumn<TestData>[] = [
  { key: 'isin', header: 'ISIN' },
  { key: 'name', header: 'Name' },
  { key: 'price', header: 'Price', render: (item) => `$${item.price}` },
];

const data: TestData[] = [
  { isin: '123', name: 'Stock A', price: 100 },
  { isin: '456', name: 'Stock B', price: 200 },
];

describe('Table Component', () => {
  it('renders table with data', () => {
    render(<Table data={data} columns={columns} />);

    columns.forEach((column) => {
      expect(screen.getByText(column.header)).toBeInTheDocument();
    });

    data.forEach((item) => {
      expect(screen.getByText(item.isin)).toBeInTheDocument();
      expect(screen.getByText(item.name)).toBeInTheDocument();
      expect(screen.getByText(`$${item.price}`)).toBeInTheDocument();
    });
  });

  it('renders selectable table and handles selection', () => {
    const onSelectionChange = jest.fn();
    render(<Table data={data} columns={columns} selectable onSelectionChange={onSelectionChange} />);

    const selectAllCheckbox = screen.getByLabelText('select-all-checkbox');
    expect(selectAllCheckbox).toBeInTheDocument();

    data.forEach((item) => {
      expect(screen.getByLabelText(`${item.isin}-checkbox`)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('123-checkbox'));
    expect(onSelectionChange).toHaveBeenCalledWith([{ isin: '123', name: 'Stock A', price: 100 }]);

    fireEvent.click(screen.getByLabelText('456-checkbox'));
    expect(onSelectionChange).toHaveBeenCalledWith([
      { isin: '123', name: 'Stock A', price: 100 },
      { isin: '456', name: 'Stock B', price: 200 },
    ]);

    fireEvent.click(screen.getByLabelText('123-checkbox'));
    expect(onSelectionChange).toHaveBeenCalledWith([{ isin: '456', name: 'Stock B', price: 200 }]);

    fireEvent.click(selectAllCheckbox);
    expect(onSelectionChange).toHaveBeenCalledWith(data);

    fireEvent.click(selectAllCheckbox);
    expect(onSelectionChange).toHaveBeenCalledWith([]);
  });
});
