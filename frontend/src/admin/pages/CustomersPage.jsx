import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  getAdminCustomersApi,
} from '../services/adminService';


function statusLabel(
  value = '',
) {

  return String(
    value,
  )
    .replaceAll(
      '_',
      ' ',
    )
    .toLowerCase()
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase(),
    );
}


export default function CustomersPage() {

  const [
    customers,
    setCustomers,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState('');


  const [
    query,
    setQuery,
  ] = useState('');


  /*
  ================================================
  LOAD CUSTOMERS
  ================================================
  */

  useEffect(() => {

    let active =
      true;


    const loadCustomers =
      async () => {

        try {

          setLoading(
            true,
          );


          setError('');


          const result =
            await getAdminCustomersApi();


          if (
            active
          ) {

            setCustomers(
              result,
            );
          }


        } catch (error) {

          if (
            active
          ) {

            setError(
              error.message ||
              'Unable to load customers.',
            );
          }


        } finally {

          if (
            active
          ) {

            setLoading(
              false,
            );
          }
        }
      };


    loadCustomers();


    return () => {

      active =
        false;
    };

  }, []);


  /*
  ================================================
  SEARCH
  ================================================
  */

  const filteredCustomers =
    useMemo(() => {

      const search =
        query
          .trim()
          .toLowerCase();


      if (!search) {

        return customers;
      }


      return customers.filter(
        (customer) => {

          const text =
            `
              ${customer.id || ''}
              ${customer.firstName || ''}
              ${customer.lastName || ''}
              ${customer.email || ''}
              ${customer.mobile || ''}
              ${customer.status || ''}
            `
              .toLowerCase();


          return text.includes(
            search,
          );
        },
      );

    }, [
      customers,
      query,
    ]);


  return (

    <>

      <div className="admin-title">

        <div>

          <p>
            Customer management
          </p>


          <h1>
            Customers
          </h1>

        </div>


        <div
          style={{
            fontWeight:
              700,
          }}
        >

          Total Customers:
          {' '}

          {
            customers.length
          }

        </div>

      </div>


      <section className="admin-card">

        <div className="order-toolbar">

          <input
            type="search"
            value={
              query
            }
            onChange={
              (event) =>
                setQuery(
                  event.target.value,
                )
            }
            placeholder="Search customer by name, email or mobile"
          />

        </div>


        {
          loading
            ? (

              <div
                style={{
                  padding:
                    '40px',

                  textAlign:
                    'center',
                }}
              >
                Loading customers...
              </div>
            )

            : error
              ? (

                <div
                  style={{
                    padding:
                      '40px',

                    textAlign:
                      'center',
                  }}
                >

                  <strong>
                    Unable to load customers
                  </strong>


                  <p>
                    {
                      error
                    }
                  </p>

                </div>
              )

              : filteredCustomers.length ===
                0
                ? (

                  <div
                    style={{
                      padding:
                        '40px',

                      textAlign:
                        'center',
                    }}
                  >

                    <h2>
                      No customers found
                    </h2>

                  </div>
                )

                : (

                  <div className="order-table">

                    <div className="table-head">

                      <span>
                        Customer
                      </span>

                      <span>
                        Contact
                      </span>

                      <span>
                        Role
                      </span>

                      <span>
                        Status
                      </span>

                      <span>
                        Verified
                      </span>

                    </div>


                    {
                      filteredCustomers.map(
                        (customer) => (

                          <div
                            className="table-row"
                            key={
                              customer.id
                            }
                          >

                            <span>

                              <b>

                                {
                                  customer.firstName
                                }

                                {' '}

                                {
                                  customer.lastName
                                }

                              </b>


                              <small>

                                ID #
                                {
                                  customer.id
                                }

                              </small>

                            </span>


                            <span>

                              {
                                customer.email
                              }


                              <small>
                                {
                                  customer.mobile
                                }
                              </small>

                            </span>


                            <span>
                              {
                                statusLabel(
                                  customer.role,
                                )
                              }
                            </span>


                            <span>

                              <span
                                className={
                                  `order-status status-${String(
                                    customer.status ||
                                    '',
                                  ).toLowerCase()}`
                                }
                              >

                                {
                                  statusLabel(
                                    customer.status,
                                  )
                                }

                              </span>

                            </span>


                            <span>

                              {
                                customer.emailVerified
                                  ? 'Yes'
                                  : 'No'
                              }

                            </span>

                          </div>
                        ),
                      )
                    }

                  </div>
                )
        }

      </section>

    </>
  );
}