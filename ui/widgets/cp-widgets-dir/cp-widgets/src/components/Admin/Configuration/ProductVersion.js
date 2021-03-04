import React, { Component } from 'react';
import { DataTable, TableContainer, Table, TableHead, TableRow, TableHeader, TableBody, TableCell, ToggleSmall, Button} from 'carbon-components-react';
import { SubtractAlt16 } from '@carbon/icons-react';


class ProductVersion extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.filterText = "";
    }
    render() {
        return ( 
            <div>
                <DataTable rows={rowData} headers={headerData}>
                {({ rows, headers, getHeaderProps, getTableProps }) => (
                    <TableContainer>
                        <Table {...getTableProps()}>
                            <TableHead>
                                <TableRow>
                                    {headers.map((header) => (
                                    <TableHeader {...getHeaderProps({ header })}>
                                        {header.header}
                                    </TableHeader>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.cells.map((cell) => (
                                            <TableCell key={cell.id}>{cell.value}</TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
                </DataTable>
                <br/>
                <Button size='field' kind='tertiary'>Add Product Version +</Button>
            </div>    
        );
    }
}

const headerData = [
    {
      header: 'Entando Version',
      key: 'entVersion',
    },
    {
      header: 'Status *',
      key: 'status',
    },
    {
      header: 'Start Date',
      key: 'startDate',
    },
    {
      header: 'Support End Date',
      key: 'endDate',
    }
  ];

const rowData = [
    {
         id: 'a',
         entVersion: '5.2',
         status:  <ToggleSmall aria-label="toggle button" defaultToggled id="status-1" />,
         startDate: 'April, 2018',
         endDate: 'April, 2022',
    },
    {
        id: 'b',
        entVersion: '6.3',
        status:  <ToggleSmall aria-label="toggle button"  id="status-2" />,
        startDate: 'Jile, 2019',
        endDate: 'April, 2023',
    },
    {
        id: 'c',
        entVersion: '6.2',
        status:  <ToggleSmall aria-label="toggle button" defaultToggled id="status-3" />,
        startDate: 'September, 2020',
        endDate: 'April, 2024',
     },
];
   
export default ProductVersion;