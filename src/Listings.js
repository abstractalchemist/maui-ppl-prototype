import { useState, useEffect, useMemo  } from "react";
import { API } from "aws-amplify";
import { useTable, useGlobalFilter } from "react-table";
import { Container, Row, Col, Form } from "react-bootstrap";
import { Auth } from 'aws-amplify';
import { listPeople } from "./graphql/queries";

function GlobalFilter({ preGlobalFilteredRows, setGlobalFilter}) {
  return (
    <div>
      <Form>
        <Form.Group className="mb-3" controlId="formSearch">
          <Form.Label>Search</Form.Label>
          <Form.Control type="text" placeholder="Search or Filter" onChange={evt => {
            const value = evt.target.value || undefined
            setGlobalFilter(value)
          }}/>
        </Form.Group>
      </Form>
    </div>
  )
}

function Listings() {

  const [listings, setListings] = useState([]);
  

  useEffect(() => {
    (async () => {
      if(Auth.currentAuthenticatedUser()) {
        const listingsData = await API.graphql({ query: listPeople})
        setListings(listingsData.data.listPeople.items);
      }
      else {
        const listingsData = await API.graphql({ query: `
          query ListPeople($nextToken: String) {
            listPeople(nextToken: $nextToken) {
              items {
                id
                name
                status
                createdAt
              }
              nextToken
          }
        }
        `});
        setListings(listingsData.data.listPeople.items);
      }
    })();
  }, []);


  const columns = useMemo(() => [
    {
      Header: 'Name',
      accessor: 'name'

    },

    {
      Header: 'Status',
      accessor: 'status'

    },
    {
      Header: 'Reported By',
      accessor: 'reportedBy'
    }
  ], []);


  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
    preGlobalFilteredRows
  } = useTable({ columns, data: listings }, useGlobalFilter)

  return (
    <Container fluid>
      <Row>
        <GlobalFilter setGlobalFilter={setGlobalFilter} preGlobalFilteredRows={preGlobalFilteredRows}/>
      </Row>
      <Row>
        <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps()}
                    style={{
                      borderBottom: 'solid 3px red',
                      background: 'aliceblue',
                      color: 'black',
                      fontWeight: 'bold',
                    }}
                  >
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        style={{
                          padding: '10px',
                          border: 'solid 1px gray',
                          background: 'papayawhip',
                        }}
                      >
                        {cell.render('Cell')}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </Row>
    </Container>
  )
}

export default Listings;