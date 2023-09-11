import { useEffect,useState,useCallback } from "react";
import { json } from "@remix-run/node";
import {
  Link as XLink,
  useActionData,
  useLoaderData,
  useNavigation,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
import {
  Page,
  Layout,
  VerticalStack,
  Card,
  LegacyCard,
  Text,
  Link,
  Badge,
  HorizontalStack,
  Box,
  Button,
  useIndexResourceState,
  useSetIndexFiltersMode,
  IndexTable,
  ChoiceList,
  IndexFilters,
  RangeSlider,
} from "@shopify/polaris";

import { authenticate } from "../shopify.server";
import {} from "@shopify/polaris-icons";
import { ProductListing } from "node_modules/@shopify/shopify-api/rest/admin/2023-07/product_listing";

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);

  const response = await admin.graphql(
    `#graphql
      query {
        products(first: 10, reverse: true) {
          edges {
            node {
              id
              title
              handle
              resourcePublicationOnCurrentPublication {
                publication {
                  name
                  id
                }
                publishDate
                isPublished
              }
            }
          }
        }
      }
    `
  );
  const responseJson = await response.json();

  return json({
    shop: session.shop.replace(".myshopify.com", ""),
    products: responseJson.data.products.edges,
  });
};

export async function action({ request }) {
  const { admin, session } = await authenticate.admin(request);
  const response = await admin.graphql(
    `#graphql
      query {
        products(first: 1, reverse: true) {
          edges {
            node {
              id
              title
              handle
              resourcePublicationOnCurrentPublication {
                publication {
                  name
                  id
                }
                publishDate
                isPublished
              }
            }
          }
        }
      }
    `
  );
  const responseJson = await response.json();

  return json({
    shop: session.shop.replace(".myshopify.com", ""),
    productsList: responseJson.data.products,
  });
}

export default function Index() {
  const nav = useNavigation();
  const navigate = useNavigate();
  let products = useLoaderData().products;
  const actionData = useActionData();
  const submit = useSubmit();

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  const [itemStrings, setItemStrings] = useState([
    'All',
    'Unpaid',
    'Open',
    'Closed',
    'Local delivery',
    'Local pickup',
  ]);
  const isLoading = ["loading", "submitting"].includes(nav.state) && nav.formMethod === "POST";


  const resourceName = {
    singular: 'product',
    plural: 'products',
  };

  const {selectedResources, allResourcesSelected, handleSelectionChange} =
    useIndexResourceState(products);

  const rowMarkup = products.map(
    ({node}, index) => (
      <IndexTable.Row
        id={node.id}
        key={node.id}
        selected={selectedResources.includes(node.id)}
        position={index}
      >
        <IndexTable.Cell>{node.id}</IndexTable.Cell>
        <IndexTable.Cell>{node.title}</IndexTable.Cell>
        <IndexTable.Cell>{node.handle}</IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  const generateProduct = () => submit({}, { replace: true, method: "POST" });
  return (
    <Page fullWidth
      backAction={{content: 'Products', url: '/app'}}
      title={"Products"}
      primaryAction={{ content: "Add product" }}
      secondaryActions={[
        {
          content: "Export",
          accessibilityLabel: "Export product list",
          onAction: () => alert("Export action"),
        },
        {
          content: "Import",
          accessibilityLabel: "Import product list",
          onAction: () => alert("Import action"),
        },
      ]}
      >
      {/* <ui-title-bar title="Products">
        <button variant="primary" onClick={generateProduct}>Generate a product</button>
      </ui-title-bar> */}
        <Layout>
          <Layout.Section>
            {/* <LegacyCard>
              <VerticalStack gap="5">
                <HorizontalStack>
                  <Button loading={isLoading} primary onClick={generateProduct}>
                    Generate a product
                  </Button>
                    <Box
                      padding="4"
                      background="bg-subdued"
                      borderColor="border"
                      borderWidth="1"
                      borderRadius="2"
                      overflowX="scroll"
                    >
                      <pre style={{ margin: 0 }}>
                        <code>{JSON.stringify(products, null, 2)}</code>
                      </pre>
                    </Box>
                </HorizontalStack>
              </VerticalStack>
            </LegacyCard> */}
            <LegacyCard>
              <IndexTable
                resourceName={resourceName}
                itemCount={products.length}
                selectedItemsCount={
                  allResourcesSelected ? 'All' : selectedResources.length
                }
                onSelectionChange={handleSelectionChange}
                headings={[
                  {title: 'Name'},
                  {title: 'Title'},
                  {title: 'Handle'},
                ]}
              >
                {rowMarkup}
              </IndexTable>
            </LegacyCard>
          </Layout.Section>
        </Layout>
    </Page>
  );
}
