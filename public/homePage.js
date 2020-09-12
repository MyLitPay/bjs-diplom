"use strict";

const logoutButton = new LogoutButton();
logoutButton.action = () => {
    ApiConnector.logout(response => {
        if (response.success) {
            location.reload();
        }
    });
}

ApiConnector.current(res => {
    if (res.success) {
        ProfileWidget.showProfile(res.data);
    }
});

const ratesBoard = new RatesBoard();
function getRates() {
    ApiConnector.getStocks(res => {
        if (res.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(res.data);
        }
    });
}
setInterval(getRates(), 60000);


const moneyManager = new MoneyManager();

function showProfileAndMessage(res) {
    if (res.success) {
        ProfileWidget.showProfile(res.data);
        res.error = "Успешно";
    }
    moneyManager.setMessage(res.success, res.error);
}

moneyManager.addMoneyCallback = data => {
    ApiConnector.addMoney(data, res => {
        showProfileAndMessage(res);
    });
}

moneyManager.conversionMoneyCallback = data => {
    ApiConnector.convertMoney(data, res => {
        showProfileAndMessage(res);
    });
}

moneyManager.sendMoneyCallback = data => {
    ApiConnector.transferMoney(data, res => {
        showProfileAndMessage(res);
    });
}


const favoritesWidget = new FavoritesWidget();

function updateWidgetAndManager(res, successMessage = "") {
    if (res.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(res.data);
        moneyManager.updateUsersList(res.data);
        res.error = successMessage;
    }
}

ApiConnector.getFavorites(res => {
    updateWidgetAndManager(res);
});

favoritesWidget.addUserCallback = data => {
    ApiConnector.addUserToFavorites(data, res => {
        updateWidgetAndManager(res, "Контакт добавлен");
        favoritesWidget.setMessage(res.success, res.error);
    });
}

favoritesWidget.removeUserCallback = data => {
    ApiConnector.removeUserFromFavorites(data, res => {
        updateWidgetAndManager(res, "Контакт удалён");
        favoritesWidget.setMessage(res.success, res.error);
    });
}
