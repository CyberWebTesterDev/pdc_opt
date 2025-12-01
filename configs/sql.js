//sqlext_tasks
module.exports.SQL_SELECT_CAMUNDA_ACTUAL_TASKS = {
  text: `select
    b.version_ "ver", proc_inst_id_,
    proc_def_key_,
    execution_id_,
    act_name_,
    act_type_,
    act_id_,
    assignee_,
    start_time_,
    end_time_,
    act_inst_state_,
    sequence_counter_
    from act_hi_actinst a, act_re_procdef b
 where a.proc_def_id_ = b.id_
 and proc_inst_id_ = $1::text
 order by start_time_ desc`,
  values: [],
};
//sqlext_tasks_arch
module.exports.SQL_SELECT_CAMUNDA_ARCHIVE_TASKS = {
  text: `select
    proc_def_key_,
    execution_id_,
    act_name_,
    act_type_,
    act_id_,
    assignee_,
    start_time_,
    end_time_,
    act_inst_state_,
    sequence_counter_
    from camunda_db.public.act_hi_actinst
    where proc_inst_id_ in (
    select proc_inst_id_ from camunda_db.public.act_hi_procinst
    where business_key_ = $1::text
    )
    order by start_time_ desc`,
  values: [],
};
//sqlext_process
module.exports.SQL_SELECT_CAMUNDA_PROCESS_ID = {
  text: `select proc_inst_id_ from act_ru_variable
    where name_='applicationNum'
    and long_=$1`,
  values: [],
};
//sqlext_process_2
module.exports.SQL_SELECT_CAMUNDA_PROCESS_ID_2 = {
  text: `select proc_inst_id_ from camunda_db.public.act_ru_execution
    where business_key_ = $1::text`,
  values: [],
};

module.exports.SQL_SELECT_CAMUNDA_VARIABLE_ERROR_MESSAGE = {
  text: `select c.text_ as "mError" from act_ru_variable c where c.name_='errorMessage'
    and c.proc_inst_id_ = $1::text`,
  values: [],
};

module.exports.SQL_SELECT_CAMUNDA_VARIABLE_ERROR_STACK_TRACE = {
  text: `select c.text_ as "Error" from act_ru_variable c where c.name_='errorStackTrace'
    and c.proc_inst_id_ = $1::text`,
  values: [],
};

module.exports.SQL_SELECT_CAMUNDA_VARIABLE_ERROR_BUSINESS = {
  text: `select c.text_ as "bError" from act_ru_variable c where c.name_='businessError'
    and c.proc_inst_id_ = $1::text`,
  values: [],
};

module.exports.sqltest = {
  text: `select c.scheme_name
    from pgtestdb.public.variables b, pgtestdb.public.process_instances c
    where c.id_ = b.process_id_
    and b.name_ = 'appnumber'
    and b.value_ = $1::text`,
  values: [],
};
//sqlapp
module.exports.SQL_SELECT_SEARCHSTORESERVICE_APPLICATIONSEARCH = {
  text: `select
    application_id, creation_date, date_status, appstatus_name, branch_unit_id, branch_unit_name,
    credit_type_name, api, sale_channel_name, method, assignee, execution_id,
    case
    when channel_of_issue = '0f03bebf-27eb-4247-8f5d-3f57e686437d' then 'Партнер'
    when channel_of_issue = '77bc521e-3f74-4d2e-b704-c6c3b9715e77' then 'ВП'
    when channel_of_issue = '1de7cadf-ecee-4507-97f4-c37522fa28b0' then 'Курьер'
    when channel_of_issue = '1727bbc5-39b9-4a22-934d-4905d9d01c61' then 'ДО'
    when channel_of_issue = '5b0e7e4c-deff-482a-a515-754840241d3f' then 'МБ'
    end as "issue_channel"
    from searchstoreservice.searchstoreservice.applicationsearch where application_number = $1`,
  values: [],
};
//sqlExecutionsLog
module.exports.SQL_SELECT_SEARCHSTORESERVICE_BPM_EXECUTIONS = {
  text: `select bpm_execution_id, method, assignee, borrower, create_time, complete_time, due_date from searchstoreservice.searchstoreservice.bpm where
    applicationsearch_id in (
        select distinct id from searchstoreservice.searchstoreservice.applicationsearch
        where application_number = $1)
    order by creation_date desc`,
  values: [],
};
//sqlProcessLog
module.exports.SQL_SELECT_CAMUNDA_PROCESS_HISTORY = {
  text: `select proc_inst_id_, proc_def_key_, start_time_, end_time_, duration_, start_act_id_, end_act_id_, state_ from camunda_db.public.act_hi_procinst
    where business_key_ = $1::text
    order by start_time_ desc`,
  values: [],
};
//sqlJobLog
module.exports.SQL_SELECT_CAMUNDA_JOB_HISTORY = {
  text: `select *
    from
    camunda_db.public.act_ru_job j,
    camunda_db.public.act_ru_jobdef jd
    where j.job_def_id_ = jd.id_
    and process_instance_id_ in (
    select distinct proc_inst_id_ from camunda_db.public.act_hi_procinst
    where business_key_ = $1::text
    )`,
  values: [],
};
//sqlclient
module.exports.sqlclient = {
  text: `
    select
    f.surname,
    f.name,
    f.patronymic,
    f.birth_date,
    d.doc_series,
    d.doc_num,
    c.phone_number
    from
    clientservice.clientservice.client_form f,
    clientservice.clientservice.identity_documents d,
    clientservice.clientservice.contacts c
    where f.id = d.client_form_id
    and f.id = c.client_form_id
    and d.prev_main = false
    and c.type_id = '219324f3-3633-4020-ab5d-fdc21ba4eb03'
    and f.application_num = $1`,
  values: [],
};
//sqlp
module.exports.SQL_SELECT_APPLICATION_CREDIT_PARAMETERS = {
  text: 'select * from application.application.credit_parameters where'+
  'application_id = (select distinct (id) from application.application.applications where app_sequence = $1)',
  values: [],
};
//sqlApplication
module.exports.SQL_SELECT_APPLICATION_DATA = {
  text: 'select * from application.application.applications where app_sequence = $1',
  values: [],
};
//sqlAutoApplication
module.exports.SQL_SELECT_AUTOAPPLICATION_DATA = {
  text: `select * from autotestservice.application.applications
    where app_sequence = $1`,
  values: [],
};
//sqlpauto
module.exports.SQL_SELECT_AUTOAPPLICATION_CREDIT_PARAMETERS = {
  text: `select *,
    case
        when type_id = '853d04c5-512c-4295-9e08-7fc41dbd9ebc' then 'Выданные'
        when type_id = '3cf09efb-a537-4b9c-a4d9-6e832efcbbcd' then 'Одобренные'
        when type_id = '15b51b9b-36b8-4f0f-a1c7-3753a914b214' then 'Выбранные'
        when type_id = '4a87b6dc-be2a-48fb-b1b2-ccfcac5db2ee' then 'Предв. одобренные'
    end as "case_partype",
    case
    when payment_type_id = '33c30754-359b-4e34-bb98-5b193c7ecef0' then 'Аннуитетный'
    when payment_type_id = 'f9a1542e-ae55-4489-ae5f-63802fa7fc1d' then 'Дифференцированный'
    end as "case_payment"
    from autotestservice.application.credit_parameters
    where application_id = (select distinct (id) from autotestservice.application.applications where app_sequence = $1)`,
  values: [],
};
//sqlpautovehicle
module.exports.SQL_SELECT_AUTOAPPLICATION_VEHICLE = {
  text: `select * from autotestservice.application.vehicle where
    application_id = (select id from autotestservice.application.applications where app_sequence = $1)`,
  values: [],
};
//sqlpotrebakk
module.exports.SQL_SELECT_APPLICATION_ACCOUNTS = {
  text: `select * from application.application.accounts
    where credit_parameters_id in (select id from application.application.credit_parameters where application_id = (select distinct (id) from application.application.applications where app_sequence = $1))`,
  values: [],
};
//sqlautoakk
module.exports.SQL_SELECT_AUTOAPPLICATION_ACCOUNTS = {
  text: `select * from autotestservice.application.accounts
    where credit_parameters_id in (select id from autotestservice.application.credit_parameters where application_id = (select distinct (id) from autotestservice.application.applications where app_sequence = $1))`,
  values: [],
};
//sqlpotrebrefin
module.exports.SQL_SELECT_APPLICATION_REFINANCE = {
  text: `select *,
    case
    when source_type = '61c2fa98-ab82-4fc3-9ec8-c697482964db' then 'Внешний (БКИ)'
    when source_type = '9fde6153-854b-4e7f-9efc-d4422958319e' then 'Внутренний (ИКАР)'
    when source_type = 'd47eb062-7597-4c91-9754-b5dbd63f262e' then 'Вручную'
    end as "source",
    case
    when type_id = '4439e3f3-373c-4fbe-94e4-e0144816116e' then 'Кредитная карта'
    when type_id = '5ef5250b-cbe7-487b-9156-dd8092eaae00' then 'Потребительский кредит'
    end as "typeliab"
    from application.application.refinance_liabilities where applications_id = (select distinct (id) from application.application.applications where app_sequence = $1) and selected = true`,
  values: [],
};
//sqlpotrebrefin_2
module.exports.SQL_SELECT_APPLICATION_REFINANCE_2 = {
  text: `select *,
    case
    when source_type = '61c2fa98-ab82-4fc3-9ec8-c697482964db' then 'Внешний (БКИ)'
    when source_type = '9fde6153-854b-4e7f-9efc-d4422958319e' then 'Внутренний (ИКАР)'
    when source_type = 'd47eb062-7597-4c91-9754-b5dbd63f262e' then 'Вручную'
    end as "source",
    case
    when type_id = '4439e3f3-373c-4fbe-94e4-e0144816116e' then 'Кредитная карта'
    when type_id = '5ef5250b-cbe7-487b-9156-dd8092eaae00' then 'Потребительский кредит'
    end as "typeliab",
    rl.debt_amount as bki_debt_amount,
    sd.debt_amount as statement_debt_amount,
    sd.deleted as statement_debt_deleted
    from application.application.refinance_liabilities rl, application.application.statements_debt sd
    where rl.id = sd.id
    and rl.applications_id = (select distinct (id) from application.application.applications where app_sequence = $1) and rl.selected = true`,
  values: [],
};

module.exports.SQL_POTREB_REFIN_LIAB_ALL = {
  text: `select *,
    case
    when source_type = '61c2fa98-ab82-4fc3-9ec8-c697482964db' then 'Внешний (БКИ)'
    when source_type = '9fde6153-854b-4e7f-9efc-d4422958319e' then 'Внутренний (ИКАР)'
    when source_type = 'd47eb062-7597-4c91-9754-b5dbd63f262e' then 'Вручную'
    end as "source",
    case
    when type_id = '4439e3f3-373c-4fbe-94e4-e0144816116e' then 'Кредитная карта'
    when type_id = '5ef5250b-cbe7-487b-9156-dd8092eaae00' then 'Потребительский кредит'
    end as "typeliab"
    from application.application.refinance_liabilities
    where applications_id = (select distinct (id) from application.application.applications where app_sequence = $1)`,
  values: [],
};

//sqlpcard
module.exports.SQL_SELECT_CCAPPLICATION_CREDIT_PARAMETERS = {
  text: `select *,
    case
        when card_personification = '2398ff57-00e2-4293-bd56-eedecfc11df7' then 'Embossed'
        when card_personification = '61ef7c30-3bfd-4214-89d4-3a06886f8c34' then 'Unembossed'
    end as "card_pers",
    case
        when type_id = '853d04c5-512c-4295-9e08-7fc41dbd9ebc' then 'Выданные'
        when type_id = '3cf09efb-a537-4b9c-a4d9-6e832efcbbcd' then 'Одобренные'
        when type_id = '15b51b9b-36b8-4f0f-a1c7-3753a914b214' then 'Выбранные'
        when type_id = '4a87b6dc-be2a-48fb-b1b2-ccfcac5db2ee' then 'Предв. одобренные'
    end as "card_par_type_id",
    case when payment_system_id = '7b081521-4f67-4873-bb1a-1594075302f9' then 'Visa'
        when payment_system_id = '54bae0a7-3252-4151-aba5-7583cb16d441' then 'Mastercard'
        when payment_system_id = '303ae180-2623-47d9-9c73-36928970db0b' then 'Мир'
    end as "payment_system",
    case when card_category_id = '548edb6d-8b6e-466f-89fb-f069c9bbf421' then 'Classic'
        when card_category_id = 'd8f0ec79-6c47-42ff-a8ef-c8fcd6a729b2' then 'Gold'
        when card_category_id = '9ec11e75-548c-4dbd-9055-f2044b969129' then 'Platinum'
        when card_category_id = '6d524865-a094-482c-a317-16526c446e30' then 'Maestro'
        when card_category_id = '9fe9f717-b7b1-41bf-a24c-10d15b60ebee' then 'Standard'
    end as "card_category"
    from cctestservice.application.credit_parameters
    where application_id = (select distinct (id) from cctestservice.application.applications where app_sequence = $1)`,
  values: [],
};
//sqlCardApplication
module.exports.SQL_SELECT_CCAPPLICATION_APPLICATION = {
  text: 'select * from cctestservice.application.applications where app_sequence = $1',
  values: [],
};

//sqlContractCard
module.exports.SQL_SELECT_CCAPPLICATION_CONTRACT_PARAMETERS = {
  text: `select * from cctestservice.application.contract_parameters
    where credit_parameters_id in (select id from cctestservice.application.credit_parameters where application_id = (select distinct (id) from cctestservice.application.applications where app_sequence = $1))`,
  values: [],
};
//sqlipotekaparams
module.exports.SQL_SELECT_MAPPLICATION_CREDIT_PARAMETERS = {
  text: `select *,
    case     when credit_target_id='229415c1-125c-475b-ac21-1f78e73fb404' then 'Приобр.недв. в строящихся объектах'
        when credit_target_id='5516ac99-240a-48e5-8ea4-c761b1acb44c' then 'Приобр. жилой недв. с оформленным правом собственности'
    end as "case_target",
    case
            when payment_type_id = '33c30754-359b-4e34-bb98-5b193c7ecef0' then 'Аннуитетный'
            when payment_type_id = 'f9a1542e-ae55-4489-ae5f-63802fa7fc1d' then 'Дифференцированный'
    end as "case_payment",
    case
            when type_id = '853d04c5-512c-4295-9e08-7fc41dbd9ebc' then 'Выданные'
            when type_id = '3cf09efb-a537-4b9c-a4d9-6e832efcbbcd' then 'Одобренные'
            when type_id = '15b51b9b-36b8-4f0f-a1c7-3753a914b214' then 'Выбранные'
            when type_id = '4a87b6dc-be2a-48fb-b1b2-ccfcac5db2ee' then 'Предв. одобренные'
    end as "case_partype",
    case
            when credit_form_type_id = 'a4df0d1b-0e1c-42b4-b249-75f290826df8' then 'Единовременный кредит'
            when credit_form_type_id = '3e97ca6a-6a60-417f-baa5-621bea739a57' then 'Кредитная линия с лимитом задолженности'
            when credit_form_type_id = '73153b97-6077-42d0-bafa-64b489395876' then 'Кредитная линия с лимитом выдачи'
            when credit_form_type_id = 'd4abaf4a-f2cd-4e47-894e-1839b42927ef' then 'Кредитование банковского счета (овердрафт)'
    end as "case_form",
    case
            when insurance_type_id = '5e0825da-84fe-4d2c-b255-b94a61640c23' then 'Страхование титула'
            when insurance_type_id = 'd9a6c448-6c14-47f4-9dd3-9342bd4a37ad' then 'Без страховки'
            when insurance_type_id = 'ed5b8b8b-7d55-4c51-84de-c8188d545c79' then 'Страхование имущества'
            when insurance_type_id = '6113d53e-6625-4059-a5f9-914f4351241e' then 'Личное страхование'
            when insurance_type_id = 'fd83b5c9-f885-4317-af15-170290e1f9ff' then 'Страхование титула + Личное страхование'
    end as "case_ins",
    case
            when market_type_id = '0e9b5d91-6534-4d0e-a5c7-28dd68654108' then 'Первичный'
            when market_type_id = '9ab0df40-3d88-44d9-b022-510f7c5e65aa' then 'Вторичный'
    end as "case_market",
    date_sign as date_sign_ipoteka
    from mtestservice.public.credit_parameters
    where application_id in (select distinct (id) from mtestservice.public.applications where app_sequence = $1)
    order by create_date asc`,
  values: [],
};
//sqlipotekaparticipants
module.exports.SQL_SELECT_MAPPLICATION_PARTICIPANTS = {
  text: `select *,
    id as part_id,
    case
                when seller_type_id = 'c3af020f-cdf8-44f3-aa41-9ca4c55a5137' then 'ИП'
                when seller_type_id = '19988f9b-0d43-486c-ae7c-c43a666713fa' then 'ЮЛ'
                when seller_type_id = '19b17220-38df-42cc-8e06-293b49b50fac' then 'ФЛ'
    end as "case_seller",
    case
                when role_id = '6bd1d578-e7f3-470c-b61e-95c6a8697098' then 'Законный представитель'
                when role_id = '51ff5780-bc10-4abc-8fed-5b39b8771020' then 'Доверенное лицо'
                when role_id = '7bc9311f-5276-4ec4-8937-121191172a87' then 'Продавец'
                when role_id = '29042e94-4729-4186-bae5-01888d3d9a9d' then 'Созаемщик без дохода'
                when role_id = '1ad414f3-9909-4f1f-b80f-7b522555967f' then 'Созаемщик с доходом'
                when role_id = '3623d89c-d007-43cc-9542-97bcc97a03f7' then 'Залогодатель'
                when role_id = '80b10279-9ee2-4f0a-847d-5b62aebfd57c' then 'Поручитель'
                when role_id = 'b5f5ea2b-0c6c-40e6-bc55-bf9fb70f0de7' then 'Заемщик'
    end as "case_role"
    from mtestservice.public.participants
    where application_id in (select distinct (id) from mtestservice.public.applications where app_sequence = $1)`,
  values: [],
};
module.exports.SQL_SELECT_CLIENT_FORM = {
  text: 'select * from clientservice.clientservice.client_form where id = $1',
  values: [],
};
//sqlipotekakks
module.exports.SQL_SELECT_MAPPLICATION_ACCOUNTS = {
  text: `select * from mtestservice.public.accounts
    where participant_id in (select id from mtestservice.public.participants where application_id in (select distinct (id) from mtestservice.public.applications where app_sequence = $1))`,
  values: [],
};
//sqlipotekaest_id
module.exports.SQL_SELECT_MAPPLICATION_REAL_ESTATE_ID = {
  text: `select * from mtestservice.public.real_estate
    where application_id in (select distinct (id) from mtestservice.public.applications where app_sequence = $1)
    and is_deleted=false`,
  values: [],
};
//sqlipotekaApplication
module.exports.SQL_SELECT_MAPPLICATION_APPLICATION = {
  text: `select * from mtestservice.public.applications
    where app_sequence = $1`,
  values: [],
};
//sqlipotekaLetterOfCredit
module.exports.SQL_SELECT_MAPPLICATION_DATA_LETTER_OF_CREDIT = {
  text: `select * from mtestservice.public.data_letter_of_credit
    where participant_id in (select id from mtestservice.public.participants where application_id in (select distinct (id) from mtestservice.public.applications where app_sequence = $1))`,
  values: [],
};
module.exports.SQL_SELECT_MAPPLICATION_PRIMARY_DATA_LETTER_OF_CREDIT = {
  text: `select * from mtestservice.public.data_letter_of_credit
    where legal_participant_id in (select id from mtestservice.public.legal_participants where application_id in (select distinct (id) from mtestservice.public.applications where app_sequence = $1))`,
  values: [],
};
//sqlipotekaTransferOrder
module.exports.SQL_SELECT_MAPPLICATION_TRANSFER_ORDER = {
  text: `select * from mtestservice.public.transfer_order
    where participant_id in (select id from mtestservice.public.participants where application_id in (select distinct (id) from mtestservice.public.applications where app_sequence = $1))`,
  values: [],
};
module.exports.SQL_SELECT_MAPPLICATION_AGGREEMENT_PURCHASE = {
  text: `select * from mtestservice.public.agreement_purchase
    where real_estate_id = $1`,
  values: [],
};
//sqlipotekaestateparams
module.exports.SQL_SELECT_MREALESTATE_REAL_ESTATE = {
  text: `select *
    from mrealestateservice.public.real_estate
    where id = $1`,
  values: [],
};
module.exports.SQL_SELECT_MREALESTATE_EVALUATION_REPORT = {
  text: `select * from mrealestateservice.public.estate_evaluation_report
    where real_estate_id = $1`,
  values: [],
};
//SQL_M_MREALESTATE_DEAL_PARAMETERS
module.exports.SQL_SELECT_MREALESTATE_DEAL_PARAMETERS = {
  text: `select * from mrealestateservice.public.deal_parameters
    where real_estate_id = $1`,
  values: [],
};
//sqlipotekaLegalDocument
module.exports.SQL_SELECT_MAPPLICATION_LEGAL_DOCUMENT = {
  text: `select * from mtestservice.public.legal_document
    where participant_id in ( select id from mtestservice.public.participants where application_id in (select distinct (id) from mtestservice.public.applications where app_sequence = $1))`,
  values: [],
};
//sqlcardakk
module.exports.SQL_SELECT_CCAPPLICATION_ACCOUNTS = {
  text: `select *,
    case when card_request_status = '4fe1eecc-7142-4cb3-95c8-d1b9b5d269fa' then 'Новая'
        when card_request_status = 'cb81f655-8c92-495e-878e-3db1fa100870' then 'Заявлена на персонализацию'
        when card_request_status = '9c33c6c6-3f09-4029-b98b-5586fcc731bf' then 'Действует'
        when card_request_status = 'a9959d9d-9a0d-4186-ad6b-7b66c7daca57' then 'Заблокирована банком'
        when card_request_status = '8fb2eb7d-c7fa-48af-934b-2ea89e5c7278' then 'Блокирована ПЦ'
        when card_request_status = '329791b8-9a9b-4c73-9c59-9fa1fdcfb073' then 'Закрыта'
        when card_request_status = '251f16ec-6641-4b30-808e-e18c46c21b88' then 'В архиве (удалена)'
        when card_request_status = '66e54750-4aa6-433d-a421-72546b3d2155' then 'Отказ в персонализации'
        when card_request_status = '70f0c63f-58ad-4d74-8543-1e0878d6fa34' then 'Сторнирована'
        when card_request_status = '1990c584-7330-4106-9c2a-477188fd79d6' then 'Запрос на переиздание'
        when card_request_status = '62e51774-ccdb-4a44-8f6a-8131540804d4' then 'На ожидании выдачи'
        when card_request_status = '0346cda7-9a84-4553-a0fd-f6fdb649cf9a' then 'Отправлена на проверку в СБ'
        when card_request_status = '72ef69b8-e4f7-4612-a147-39a92c88a991' then 'Успешно проверена СБ'
        when card_request_status = '3313bb0f-788a-4e8c-8a4c-50897bbc23a7' then 'Отказ СБ'
    end as "card_status"
    from cctestservice.application.accounts
    where credit_parameters_id IN (select id from cctestservice.application.credit_parameters where application_id = (select distinct (id) from cctestservice.application.applications where app_sequence = $1))`,
  values: [],
};

module.exports.SQL_SELECT_PARTICIPANT_FORM_ID_APPLICATION_PARTICIPANTS = {
  text: `select participant_form_id from application.participants where application_id in (
        select id from application.applications
        where app_sequence = $1)`,
  values: [],
};

module.exports.SQL_SELECT_PARTICIPANT_FORM_ID_MAPPLICATION_PARTICIPANTS = {
  text: `select participant_form_id from public.participants where application_id in (
        select id from public.applications
        where app_sequence = $1
        )
    and role_id = 'b5f5ea2b-0c6c-40e6-bc55-bf9fb70f0de7'
    and is_deleted = false`,
  values: [],
};

module.exports.SQL_SELECT_CLIENTSERVICE_PARTICIPANT = {
  text: `select * from
    clientservice.clientservice.client_form cf,
    clientservice.clientservice.identity_documents id
    where
    cf.id = id.client_form_id
    and cf.id = $1
    and id.prev_main = 'false'`,
  values: [],
};

module.exports.sqladmin = {
  text: `select
    interaction_id,
    interaction_correlation_id,
    im.value as im_value,
    case
    when system_id = '22d74ffb-7c4f-4d5f-af14-c58776baaea8' then 'СПР'
    when system_id = '62877c9e-5a48-4f48-ac2d-2a2497cd8219' then 'Икар'
    when system_id = '6eb6bb27-5de5-4187-96bf-d3795cd57513' then '5NT'
    when system_id = 'e651e6bb-4b78-4bb1-ae9b-b227ee22c20e' then 'Депозит Контракт (Томск)'
    when system_id = '13326d28-7404-4f42-be95-3c0bb8b5a2c9' then 'АБС Инверсия (Екатеринбург'
    when system_id = 'c088c6c7-d145-4ec2-a4c3-ddf89983bc2c' then 'ОКС'
    when system_id = '647ea28e-eda0-4546-84da-c3f9bca49fcc' then 'ИШ ДБО'
    when system_id = 'c285b8d9-f60a-4a57-9d57-5567e43206f6' then 'MDM'
    when system_id = '4ca5819e-8610-4540-915e-d676538c96bc' then 'АС Компас'
    when system_id = '531ba375-2f2f-450b-92ef-eb4514d05669' then 'ГПБ Open API'
    when system_id = '78deea8b-ebcb-4e51-8c7b-b2fc697c101f' then 'АС idBank'
    when system_id = '03ac1ee8-f61b-4f79-86db-5245f7fbedbf' then 'АС Текстовая аналитика'
    when system_id = '36b1b3fd-f37a-4da7-8f62-f2c5c49f6b44' then 'Тесса'
    end as "System", result, error_description,
    interaction_ts, body, content_type, application_seq
    from rkk2admin.system_interaction si left join rkk2admin.interaction_metadata im
    on im.system_interaction_id = si.id
    where 1=1
    and application_seq = $1
    order by interaction_ts desc`,
  values: [],
};

module.exports.sqlstatus = {
  text: `select * from afs.info_app_status where element_code=$1::text
    order by start_date asc`,
  values: [],
};

module.exports.sqlevent = {
  text: `select *, case
    when a.event_type_id='8cec5e06-b6f2-453a-8c85-257bed1b4642' then 'Изменение статуса (STATUS_CHANGE)'
    when a.event_type_id='42f09605-bd20-4847-acfe-11c90ff104f5' then 'Изменение данных в рамках задачи (DATA_CHANGE)'
    when a.event_type_id='8e3dfcf2-820e-488c-80e1-fbfe884dd274' then 'В BPM произошло создание новой задачи с указанием пользователя, кто ее исполнит (RECREATE)'
    when a.event_type_id='399d02d4-5716-4313-aab2-85416aa560ce' then 'Пользователь завершил рассмотрение заявки на данном этапе рассмотрения заявки (COMPLETE)'
    when a.event_type_id='14ab4806-9cbb-4a62-aee0-13ce47b1d73f' then 'Пользователь переназначил заявку с одного пользователя на другого (REASSIGN)'
    when a.event_type_id='85d32188-e186-4089-8ac9-0b77df7425fc' then 'Пользователь вернул заявку в очередь (снял назначенного пользователя на задачу)(UNASSIGN)'
    when a.event_type_id='073d7aaa-28bd-41d6-8f48-4faf56271cdc' then 'Пользователь отложил заявку (снял отметку, что она находится у него в работе) (FREE)'
    when a.event_type_id='9cd31d2b-23ee-418d-bd44-95ed8a8fe88c' then 'Пользователь взял задачу в работу, отметил себя как текущий пользователь, работающий с заявкой (BORROW)'
    when a.event_type_id='d0a61ce3-9f16-42e7-874b-967dbd5f39dc' then 'В BPM произошло создание новой задачи, она ни за кем не закреплена (CREATE)'
    when a.event_type_id='51e8d7bc-825e-4c65-aff1-95c90139c01a' then 'Пользователь назначил заявку на пользователя (до этого не была за кем-либо закреплена) (ASSIGN)'
    end "event_description"
    from statusviewservice.journal.record_log a, statusviewservice.journal.record_log_payload b
    where a.app_sequence = $1
    and a.record_id = b.record_id
    and b.name = 'login'
    order by a.event_time asc`,
  values: [],
};

module.exports.sqlmon = {
  text: `SELECT interaction_correlation_id,
    case
    when system_id = '22d74ffb-7c4f-4d5f-af14-c58776baaea8' then 'СПР'
    when system_id = '62877c9e-5a48-4f48-ac2d-2a2497cd8219' then 'Икар'
    when system_id = '6eb6bb27-5de5-4187-96bf-d3795cd57513' then '5NT'
    when system_id = 'e651e6bb-4b78-4bb1-ae9b-b227ee22c20e' then 'Депозит Контракт (Томск)'
    when system_id = '13326d28-7404-4f42-be95-3c0bb8b5a2c9' then 'АБС Инверсия (Екатеринбург'
    end as "System",
    result, error_description, interaction_ts, body, content_type, application_seq
    FROM rkk2admin.system_interaction where 1=1
    and result = 'Ошибка'
    and interaction_ts >= now() - interval '14 hours'
    order by interaction_ts desc`,
  values: [],
};

module.exports.sqlmon2 = {
  text: `select distinct (select b.text_ from act_ru_variable b where a.proc_inst_id_ = b.proc_inst_id_ and b.name_='applicationNum') "appnumber", a.act_name_ ,a.proc_def_key_, b.version_,
    (select c.text_ from act_ru_variable c where a.proc_inst_id_ = c.proc_inst_id_ and c.name_='errorStackTrace') "Error",
    (select c.text_ from act_ru_variable c where a.proc_inst_id_ = c.proc_inst_id_ and c.name_='businessError') "bError",
    (select c.text_ from act_ru_variable c where a.proc_inst_id_ = c.proc_inst_id_ and c.name_='errorMessage') "mError",
    a.start_time_,
    a.proc_inst_id_
    from act_hi_actinst a, act_re_procdef b
    where a.act_inst_state_ = 2
    and a.proc_def_id_ = b.id_
    and a.act_type_ = 'serviceTask'
    and a.start_time_ >= now() - interval '3 day'
    and a.proc_inst_id_ in ( select distinct (proc_inst_id_) from act_hi_actinst
                    where proc_def_key_ in ('CC_GPM_Signing', 'CC_GPM_DeliveryAndSigning', 'CCDO_Signing')
                    and act_type_ = 'intermediateConditional'
                        and act_inst_state_ = 0
                        )
    order by a.start_time_ desc`,
  values: [],
};

module.exports.sqlmon3 = {
  text: `select (select b.text_ from act_ru_variable b where
        a.proc_inst_id_ = b.proc_inst_id_ and b.name_='applicationNum') "appnumber", a.act_name_ , a.proc_def_key_, b.version_ "ver",
        (select c.text_ from act_ru_variable c where a.proc_inst_id_ = c.proc_inst_id_ and c.name_='errorStackTrace') "Error",
        (select c.text_ from act_ru_variable c where a.proc_inst_id_ = c.proc_inst_id_ and c.name_='businessError') "bError",
        (select c.text_ from act_ru_variable c where a.proc_inst_id_ = c.proc_inst_id_ and c.name_='errorMessage') "mError",
        a.start_time_
        from act_hi_actinst a, act_re_procdef b
        where 1=1
        and a.proc_def_id_ = b.id_
        and a.act_name_ = 'Обработка ошибки'
        and a.act_inst_state_ = 0
        and a.act_type_ = 'userTask'
        and a.start_time_ >=  now() - interval '5 day'
        order by a.start_time_ desc`,
  values: [],
};

module.exports.sqlmon3_DO = {
  text: `select (select b.text_ from act_ru_variable b where
    a.proc_inst_id_ = b.proc_inst_id_ and b.name_='applicationNum') "appnumber", a.act_name_ , a.proc_def_key_, b.version_ "ver",
    (select c.text_ from act_ru_variable c where a.proc_inst_id_ = c.proc_inst_id_ and c.name_='errorStackTrace') "Error",
    (select c.text_ from act_ru_variable c where a.proc_inst_id_ = c.proc_inst_id_ and c.name_='businessError') "bError",
    (select c.text_ from act_ru_variable c where a.proc_inst_id_ = c.proc_inst_id_ and c.name_='errorMessage') "mError",
    a.start_time_
    from act_hi_actinst a, act_re_procdef b
    where 1=1
    and a.proc_def_id_ = b.id_
    and a.proc_def_key_ in ('ConsumerCredit_DataInput', 'CCDO_DataInput', 'Refinancing_DataInputAndAutoProcessing', 'ConsumerCredit_Disbursement', 'ConsumerCredit_ApprovalAndSigningContract', 'ConsumerCredit_OfferAndController', 'M_DataInputParticipants', 'M_DataInputRealEstate', 'M_DataInputRealEstate_Primary', 'M_Disbursement', 'M_Call7_8', 'M_WaitingDeal', 'M_WaitingForApproval', 'M_WaitingForDisbursement', 'Refinancing_CreditTransfer', 'Refinancing_SigningContract', 'Refinancing_SigningOffer', 'Refinancing_Underwriting', 'ConsumerCredit_Underwriting', 'AutoCredit_DataInput', 'AutoCredit_Disbursement', 'AutoCredit_ApprovalAndSigningContract', 'AutoCredit_Underwriting')
    and a.act_name_ = 'Обработка ошибки'
    and a.act_inst_state_ = 0
    and a.act_type_ = 'userTask'
    and a.start_time_ >=  now() - interval '3 day'
    order by a.start_time_ desc`,
  values: [],
};

module.exports.sqlmon3_DO_2 = {
  text: `select (select b.text_ from act_ru_variable b where
    a.proc_inst_id_ = b.proc_inst_id_ and b.name_='applicationNum') "appnumber", a.act_name_ , a.proc_def_key_, b.version_ "ver",
    (select c.text_ from act_ru_variable c where a.proc_inst_id_ = c.proc_inst_id_ and c.name_='errorStackTrace') "Error",
    (select c.text_ from act_ru_variable c where a.proc_inst_id_ = c.proc_inst_id_ and c.name_='businessError') "bError",
    (select c.text_ from act_ru_variable c where a.proc_inst_id_ = c.proc_inst_id_ and c.name_='errorMessage') "mError",
    a.start_time_
    from act_hi_actinst a, act_re_procdef b
    where 1=1
    and a.proc_def_id_ = b.id_
    and a.proc_def_key_ not in ('EC_ConsumerCredit_CustomerRequestProcessing', 'MB_ConsumerCredit_CustomerRequestProcessing', 'CC_GPM', 'AutoCredit_OmniRequest', 'MB_CC_CustomerRequestProcessing')
    and a.act_name_ = 'Обработка ошибки'
    and a.act_inst_state_ = 0
    and a.act_type_ = 'userTask'
    and a.start_time_ >=  now() - interval '5 day'
    order by a.start_time_ desc`,
  values: [],
};

module.exports.sqlmon4 = {
  text: `select
    (select b.long_ from act_ru_variable b where a.proc_inst_id_ = b.proc_inst_id_ and b.name_='applicationNum') "appnumber",
    b.version_ "ver",
    a.act_name_ ,
    a.proc_inst_id_,
    a.proc_def_key_,
    a.start_time_
    from act_hi_actinst a, act_re_procdef b
    where a.act_inst_state_ = 2
    and a.proc_def_id_ = b.id_
    and a.act_type_ = 'serviceTask'
    and a.proc_inst_id_ in ( select distinct (proc_inst_id_) from act_hi_actinst
                                    where 1=1
                                    and act_type_ = 'intermediateConditional'
                                    and act_inst_state_ = 0)
    and a.proc_def_key_ not in ('CCDO_Signing', 'CCDO_Outcome', 'CC_GPM_Signing', 'CC_GPM_DeliveryAndSigning')
    and a.start_time_ > now() - interval '2 days'
    order by a.start_time_ desc`,
  values: [],
};
