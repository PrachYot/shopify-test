import { ReactElement } from "react";
import Layout from "../layouts/v1";

function Checkout(): ReactElement {
  return(
    <div>Checkout page</div>
  )
}

const HOCCheckout: any = Checkout;

HOCCheckout.getLayout = function GetLayout(page: ReactElement) {
  return (
    <Layout title='' description=''>
      {page}
    </Layout>
  );
};

export default HOCCheckout;