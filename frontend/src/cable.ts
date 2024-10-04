import { createConsumer } from '@rails/actioncable';

const cable = createConsumer('ws://pending/cable');
export default cable;

