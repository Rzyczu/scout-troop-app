import './styles/app.scss'; // Globalne style

import initializeBootstrap from './utils/global/globalBootstrap';
import initializeEnums from './utils/global/globalEnums';
import initializeLogout from './utils/global/globalLogout';
import initializeErrorMessages from './utils/global/globalErrorMessages';
import initializeNavbar from './utils/global/globalNavbar';

document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing global app');
    initializeBootstrap();
    initializeEnums();
    initializeLogout();
    initializeErrorMessages();
    initializeNavbar();
});
