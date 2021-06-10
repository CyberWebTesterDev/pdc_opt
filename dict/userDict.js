const userDictionary = [
    {
        login: 'gpbu11805',
        personalData: 'Радько Максим (ДОПИТ)'
    },
    {
        login: 'gpbu5835',
        personalData: 'Самедов Муслим'
    },
    {
        login: 'gpbu16070',
        personalData: 'Зимин Владислав'
    },
    {
        login: 'gpbu5637',
        personalData: 'Чепкий Евгений'
    },
    {
        login: 'gpbu11790',
        personalData: 'Шестаков Михаил (дежурный ДПСИТ Томск)'
    },
    {
        login: 'gpbu11829',
        personalData: 'Шараева Лариса (дежурный ДПСИТ Томск)'
    },
    {
        login: 'gpbu9354',
        personalData: 'Ежиков Евгений (дежурный ДПСИТ Владивосток)'
    },
    {
        login: 'gpbu15061',
        personalData: 'Расулов Рустам'
    },
    {
        login: 'gpbu13051',
        personalData: 'Гладилин Александр'
    },
    {
        login: 'gpbu13452',
        personalData: 'Грунин Александр'
    },
    {
        login: 'gpbu13192',
        personalData: 'Яременко Андрей'
    },
    {
        login: 'gpbu5634',
        personalData: 'Татаркин Максим'
    },
    {
        login: 'gpbu5764',
        personalData: 'Лоскутов Анатолий'
    },
    {
        login: 'gpbu11831',
        personalData: 'Демидова Надежда (дежурный ДПСИТ Томск)'
    },
    {
        login: 'gpbu7396',
        personalData: 'Беляков Михаил (дежурный ДПСИТ)'
    },
    {
        login: 'gpbu16099',
        personalData: 'Кузнецов Алексей (ДИТРК, аналитик Тверь)'
    },
    {
        login: 'gpbu11471',
        personalData: 'Морозова Екатерина (дежурный ДПСИТ)'
    },
    {
        login: 'gpbu6346',
        personalData: 'Горяйнова Марина (дежурный ДПСИТ)'
    },
    {
        login: 'gpbu9468',
        personalData: 'Новиков Сергей (дежурный ДПСИТ)'
    },
    {
        login: 'gpbu6314',
        personalData: 'Потопахин Алексей (дежурный ДПСИТ)'
    },
    {
        login: 'gpbu6413',
        personalData: 'Тимошенко Сергей (дежурный ДПСИТ)'
    },
    {
        login: 'gpbu14644',
        personalData: 'Страхова Светлана (дежурный ДПСИТ)'
    },
    {
        login: 'gpbu12789',
        personalData: 'Филимонов Антон (дежурный ДПСИТ)'
    },
    {
        login: 'gpbu13225',
        personalData: 'Башмаков Григорий (дежурный ДПСИТ)'
    },
    {
        login: 'gpbu9359',
        personalData: 'Андриянов Андрей (дежурный ДПСИТ Владивосток)'
    },
    {
        login: 'gpbu9355',
        personalData: 'Соломонюк Семён (дежурный ДПСИТ Владивосток)'
    },
    {
        login: 'gpbu13009',
        personalData: 'Абызов Борис (дежурный ДПСИТ)'
    },
    {
        login: 'gpbu13280',
        personalData: 'Дроздова Ирина (ДИТРК, аналитик Тверь)'
    },
    {
        login: 'gpbu14662',
        personalData: 'Турыгин Дмитрий (ДИТРК, аналитик Тверь)'
    },
    {
        login: 'gpbu14199',
        personalData: 'Шакун Анастасия (ДИТРК, аналитик Тверь)'
    },
    {
        login: 'gpbu15768',
        personalData: 'Шуравина Татьяна (ДИТРК, аналитик Тверь)'
    },
    {
        login: 'gpbu8102',
        personalData: 'Третьяков Дмитрий (аналитик ДИТРК)'
    },
    {
        login: 'gpbu8415',
        personalData: 'Винников Владимир (аналитик ДИТРК)'
    },
    {
        login: 'gpbu11730',
        personalData: 'Мазуркевич Дарья (аналитик ДИТРК)'
    },
    {
        login: 'gpbu13127',
        personalData: 'Суярова Александра (разработчик ДИТРК)'
    },
    {
        login: 'gpbu18006',
        personalData: 'Захарченко Алексей Петрович'
    },
    {
        login: 'gpbu5761',
        personalData: 'Гусаков Сергей Евгеньевич'
    },
    {
        login: 'zotov',
        personalData: 'Зотов Юрий Алексеевич'
    },
    {
        login: 'gpbu18086',
        personalData: 'Елисеев Андрей Сергеевич'
    },
    {
        login: 'gpbu12225',
        personalData: 'Алейников Дмитрий Юрьевич (ДИТРК)'
    },
];

module.exports.getPersonalDataByUserName = (login) => {
    let personalDataResult;
    userDictionary.forEach(object => {
        if (object.login == login) {
            personalDataResult = object.personalData;
        }
    });
    return personalDataResult ? personalDataResult : 'Unknown user';
}
