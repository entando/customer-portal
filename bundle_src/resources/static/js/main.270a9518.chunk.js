(window["webpackJsonpproject-subscription-form-widget"]=window["webpackJsonpproject-subscription-form-widget"]||[]).push([[0],{192:function(e){e.exports=JSON.parse('{"error":{"dataLoading":"Error during server connection"},"common":{"save":"Save","dataSaved":"ProjectSubscription successfully saved","dataDeleted":"ProjectSubscription successfully deleted","notAuthenticated":"User is not authenticated.","selectFile":"Upload new file","selectImageFile":"Upload new image","download":"Download","cancel":"Cancel","delete":"Delete","yes":"Yes","no":"No"},"validation":{"required":"{{field}} is required"},"entities":{"projectSubscription":{"deleteDialog":{"title":"Delete projectSubscription","description":"Are you sure?"},"notFound":"ProjectSubscription not found","deleted":"ProjectSubscription deleted","id":"ID","level":"entities.projectSubscription.level","status":"entities.projectSubscription.status","lengthInMonths":"entities.projectSubscription.lengthInMonths","startDate":"entities.projectSubscription.startDate","notes":"entities.projectSubscription.notes"}}}')},225:function(e,t,n){e.exports=n(373)},373:function(e,t,n){"use strict";n.r(t);var a=n(28),r=n(29),i=n(34),o=n(24),c=n(30),s=n(205),l=n(53),u=n(0),d=n.n(u),p=n(9),h=n.n(p),b=n(185),f=n.n(b),m=n(419),v=n(427),g=n(417),j=n(204),O=n(17),E=d.a.createContext(null),y=n(50),k=n(134),S=n(52),w={en:n(192)};function C(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}var D=Object.keys(w).reduce((function(e,t){return function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?C(n,!0).forEach((function(t){Object(l.a)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):C(n).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({},e,Object(l.a)({},t,Object(l.a)({},"translation",w[t])))}),{}),P=k.a.t,x=function(e){!function(e,t){k.a.use(S.a).init({defaultNs:"translation",interpolation:{escapeValue:!1},resources:D,lng:e||t,fallbackLng:t,react:{useSuspense:!1}})}(e,"en"),function(e){var t={mixed:{required:function(t){var n=t.path;return e("validation.required",{field:e("entities.projectSubscription.".concat(n))})}}};y.setLocale(t)}(P)},M=function(e){return function(t){return function(e,t){var n=new CustomEvent(e,{detail:{payload:t}});window.dispatchEvent(n)}(e,t)}},N={tableAdd:"projectSubscription.table.add",tableSelect:"projectSubscription.table.select"},T={create:"projectSubscription.form.create",update:"projectSubscription.form.update",errorCreate:"projectSubscription.form.errorCreate",errorUpdate:"projectSubscription.form.errorUpdate"},F=n(13),I=n.n(F),U=n(27),A=n(22),R=n(2),L=n.n(R),z=(L.a.shape({initialized:L.a.bool,authenticated:L.a.bool}),n(206));L.a.oneOfType([L.a.func,L.a.shape({current:L.a.elementType}),L.a.shape(null)]);function W(e){var t=function(t){function n(){var t,r;Object(a.a)(this,n);for(var c=arguments.length,s=new Array(c),l=0;l<c;l++)s[l]=arguments[l];return(r=Object(i.a)(this,(t=Object(o.a)(n)).call.apply(t,[this].concat(s)))).renderWrappedComponent=function(t){var n=r.props,a=n.forwardedRef,i=Object(z.a)(n,["forwardedRef"]);return d.a.createElement(e,Object.assign({},i,{ref:a,keycloak:t}))},r}return Object(c.a)(n,t),Object(r.a)(n,[{key:"render",value:function(){return d.a.createElement(E.Consumer,null,this.renderWrappedComponent)}}]),n}(u.Component);return t.defaultProps={forwardedRef:function(){}},Object(u.forwardRef)((function(e,n){return d.a.createElement(t,Object.assign({},e,{forwardedRef:n}))}))}var H=function(e){var t=e.children,n=e.keycloak;return n.initialized&&n.authenticated?t:null},q=function(e){var t=e.children,n=e.keycloak;return n.initialized&&n.authenticated?null:t},J=function(){return{headers:new Headers({Authorization:"Bearer ".concat(window&&window.entando&&window.entando.keycloak&&window.entando.keycloak.authenticated?window.entando.keycloak.token:""),"Content-Type":"application/json"})}},K=function(){var e=Object(U.a)(I.a.mark((function e(t,n){var a;return I.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch(t,n);case 2:if(204!==(a=e.sent).status){e.next=5;break}return e.abrupt("return",{});case 5:return e.abrupt("return",a.status>=200&&a.status<300?a.json():Promise.reject(new Error(a.statusText||a.status)));case 6:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}();function V(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function B(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?V(n,!0).forEach((function(t){Object(l.a)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):V(n).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var G="api/project-subscriptions",X=function(){var e=Object(U.a)(I.a.mark((function e(t,n){var a,r;return I.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a="".concat(t,"/").concat(G,"/").concat(n),r=B({},J(),{method:"GET"}),e.abrupt("return",K(a,r));case 3:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),Y=function(){var e=Object(U.a)(I.a.mark((function e(t,n){var a,r;return I.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a="".concat(t,"/").concat(G),r=B({},J(),{method:"POST",body:n?JSON.stringify(n):null}),e.abrupt("return",K(a,r));case 3:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),Q=function(){var e=Object(U.a)(I.a.mark((function e(t,n){var a,r;return I.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a="".concat(t,"/").concat(G),r=B({},J(),{method:"PUT",body:n?JSON.stringify(n):null}),e.abrupt("return",K(a,r));case 3:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),Z=function(){var e=Object(U.a)(I.a.mark((function e(t,n){var a,r;return I.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a="".concat(t,"/").concat(G,"/").concat(n),r=B({},J(),{method:"DELETE"}),e.abrupt("return",K(a,r));case 3:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),$=n(4),_=n(424),ee=n(406),te=n(403),ne=n(5),ae=n(407),re=n(194),ie=n.n(re),oe=n(195),ce=n.n(oe),se=n(193),le=n.n(se),ue=n(196),de=n.n(ue),pe={success:le.a,error:ie.a,info:ce.a},he={success:3e3,error:null,info:5e3},be=function e(t){var n=t.className,a=t.classes,r=t.status,i=t.message,o=t.onClose,c=!!i,s=r||e.INFO,l=pe[s],u=he[s],p=d.a.createElement("span",{className:a.message},d.a.createElement(l,{className:Object($.a)(a.icon,a.iconStatus)}),i);return d.a.createElement(_.a,{open:c,onClose:o,autoHideDuration:u},d.a.createElement(ee.a,{className:Object($.a)(a[s],n),message:p,action:[d.a.createElement(ae.a,{key:"close","aria-label":"close",color:"inherit",onClick:o},d.a.createElement(de.a,{className:a.icon}))]}))};be.SUCCESS="success",be.ERROR="error",be.defaultProps={message:null,className:"",status:be.INFO="info",onClose:function(){}};var fe=Object(ne.a)((function(e){return{message:{display:"flex",alignItems:"center"},icon:{fontSize:20},iconStatus:{opacity:.9,marginRight:e.spacing(1)},success:{backgroundColor:te.a[600]},error:{backgroundColor:e.palette.error.dark},info:{backgroundColor:e.palette.primary.main}}}),{withTheme:!0})(be),me=(L.a.shape({id:L.a.number,level:L.a.string.isRequired,status:L.a.string.isRequired,lengthInMonths:L.a.number,startDate:L.a.string,notes:L.a.string}),L.a.shape({level:L.a.string,status:L.a.string,lengthInMonths:L.a.oneOfType([L.a.string,L.a.number]),startDate:L.a.oneOfType([L.a.string,L.a.instanceOf(Date)]),notes:L.a.string}),L.a.shape({level:L.a.oneOfType([L.a.bool,L.a.shape()]),status:L.a.oneOfType([L.a.bool,L.a.shape()]),lengthInMonths:L.a.oneOfType([L.a.bool,L.a.shape()]),startDate:L.a.oneOfType([L.a.bool,L.a.shape()]),notes:L.a.oneOfType([L.a.bool,L.a.shape()])}),L.a.shape({level:L.a.oneOfType([L.a.string,L.a.shape()]),status:L.a.oneOfType([L.a.string,L.a.shape()]),lengthInMonths:L.a.oneOfType([L.a.string,L.a.shape()]),startDate:L.a.oneOfType([L.a.string,L.a.shape()]),notes:L.a.oneOfType([L.a.string,L.a.shape()])}),n(202)),ve=n(207),ge=n(412),je=n(413),Oe=n(425),Ee=n(420),ye=n(422),ke=n(16),Se=n(418),we=n(203),Ce={en:n(77).a},De=n(423),Pe=n(411),xe=n(409),Me=n(410),Ne=n(408),Te=function(e){function t(e){var n;return Object(a.a)(this,t),(n=Object(i.a)(this,Object(o.a)(t).call(this,e))).state={open:!1},n.handleOpen=n.handleOpen.bind(Object(A.a)(n)),n.discard=n.discard.bind(Object(A.a)(n)),n.confirm=n.confirm.bind(Object(A.a)(n)),n}return Object(c.a)(t,e),Object(r.a)(t,[{key:"handleOpen",value:function(){this.setState((function(){return{open:!0}}))}},{key:"handleClose",value:function(e){var t=this.props.onCloseDialog;this.setState((function(){return{open:!1}})),t(e)}},{key:"discard",value:function(){this.handleClose(t.DISCARD)}},{key:"confirm",value:function(){this.handleClose(t.CONFIRM)}},{key:"render",value:function(){var e=this.state.open,t=this.props,n=t.dialog,a=n.title,r=n.description,i=n.confirmLabel,o=n.discardLabel,c=t.Renderer;return d.a.createElement("div",null,d.a.createElement(c,{onClick:this.handleOpen}),d.a.createElement(De.a,{open:e,onClose:this.handleClose,"aria-labelledby":"confirmation-dialog-title","aria-describedby":"confirmation-dialog-description"},d.a.createElement(Ne.a,{id:"confirmation-dialog-title"},a),d.a.createElement(xe.a,null,d.a.createElement(Me.a,{id:"confirmation-dialog-description"},r)),d.a.createElement(Pe.a,null,d.a.createElement(ge.a,{onClick:this.discard,autoFocus:!0},o),d.a.createElement(ge.a,{onClick:this.confirm,color:"primary"},i))))}}]),t}(u.PureComponent);Te.CONFIRM="CONFIRM",Te.DISCARD="DISCARD";var Fe=function(e){function t(e){var n;return Object(a.a)(this,t),(n=Object(i.a)(this,Object(o.a)(t).call(this,e))).handleConfirmationDialogAction=n.handleConfirmationDialogAction.bind(Object(A.a)(n)),n}return Object(c.a)(t,e),Object(r.a)(t,[{key:"handleConfirmationDialogAction",value:function(e){var t=this.props,n=t.onDelete,a=t.values;switch(e){case Te.CONFIRM:n(a)}}},{key:"render",value:function(){var e,t=this.props,n=t.classes,a=t.values,r=t.touched,i=t.errors,o=t.handleChange,c=t.handleBlur,s=t.handleSubmit,l=t.onDelete,u=t.onCancelEditing,p=t.isSubmitting,h=t.setFieldValue,b=t.t,f=t.i18n,m=function(e){return i[e]&&r[e]?i[e]:""};return d.a.createElement(ke.a,{utils:we.a,locale:Ce[f.language]},d.a.createElement("form",{onSubmit:function(e){e.stopPropagation(),s(e)},className:n.root,"data-testid":"projectSubscription-form"},d.a.createElement(je.a,{container:!0,spacing:2},d.a.createElement(je.a,{item:!0,xs:12,sm:6},d.a.createElement(Oe.a,{htmlFor:"projectSubscription-level"},b("entities.projectSubscription.level")),d.a.createElement(Ee.a,{native:!0,id:"projectSubscription-level",error:i.level&&r.level,className:n.textField,value:a.level,name:"level",onChange:o},d.a.createElement("option",{value:""}),d.a.createElement("option",{value:"GOLD"},"GOLD"),d.a.createElement("option",{value:"PLATINUM"},"PLATINUM"))),d.a.createElement(je.a,{item:!0,xs:12,sm:6},d.a.createElement(Oe.a,{htmlFor:"projectSubscription-status"},b("entities.projectSubscription.status")),d.a.createElement(Ee.a,{native:!0,id:"projectSubscription-status",error:i.status&&r.status,className:n.textField,value:a.status,name:"status",onChange:o},d.a.createElement("option",{value:""}),d.a.createElement("option",{value:"NEW"},"NEW"),d.a.createElement("option",{value:"ACTIVE"},"ACTIVE"),d.a.createElement("option",{value:"EXPIRED"},"EXPIRED"))),d.a.createElement(je.a,{item:!0,xs:12,sm:6},d.a.createElement(ye.a,{id:"projectSubscription-lengthInMonths",error:i.lengthInMonths&&r.lengthInMonths,helperText:m("lengthInMonths"),className:n.textField,type:"number",onChange:o,onBlur:c,value:a.lengthInMonths,name:"lengthInMonths",label:b("entities.projectSubscription.lengthInMonths")})),d.a.createElement(je.a,{item:!0,xs:12,sm:6},d.a.createElement(Se.a,{id:"projectSubscription-startDate",error:i.startDate&&r.startDate,helperText:m("startDate"),className:n.textField,onChange:(e="startDate",function(t){h(e,t)}),value:a.startDate,labelFunc:function(e){return e?new Date(e).toLocaleString(f.language):""},name:"startDate",label:b("entities.projectSubscription.startDate")})),d.a.createElement(je.a,{item:!0,xs:12,sm:6},d.a.createElement(ye.a,{id:"projectSubscription-notes",error:i.notes&&r.notes,helperText:m("notes"),className:n.textField,onChange:o,onBlur:c,value:a.notes,name:"notes",label:b("entities.projectSubscription.notes")})),l&&d.a.createElement(Te,{onCloseDialog:this.handleConfirmationDialogAction,dialog:{title:b("entities.projectSubscription.deleteDialog.title"),description:b("entities.projectSubscription.deleteDialog.description"),confirmLabel:b("common.yes"),discardLabel:b("common.no")},Renderer:function(e){var t=e.onClick;return d.a.createElement(ge.a,{onClick:t,disabled:p},b("common.delete"))}}),d.a.createElement(ge.a,{onClick:u,disabled:p,"data-testid":"cancel-btn"},b("common.cancel")),d.a.createElement(ge.a,{type:"submit",color:"primary",disabled:p,"data-testid":"submit-btn"},b("common.save")))))}}]),t}(u.PureComponent);Fe.defaultProps={onCancelEditing:function(){},classes:{},values:{},touched:{},errors:{},onDelete:null};var Ie={level:"",status:"",lengthInMonths:"",startDate:null,notes:""},Ue={mapPropsToValues:function(e){return e.projectSubscription||Ie},enableReinitialize:!0,validationSchema:y.object().shape({level:y.string().required(),status:y.string().required(),lengthInMonths:y.number(),startDate:y.date().nullable(),notes:y.string().max(1024)}),handleSubmit:function(e,t){var n=t.setSubmitting;(0,t.props.onSubmit)(e),n(!1)},displayName:"ProjectSubscriptionForm"},Ae=Object(ve.a)(Object(ne.a)((function(e){return{root:{margin:e.spacing(3)},textField:{width:"100%"}}}),{withTheme:!0}),Object(S.b)(),Object(me.a)(Ue))(Fe),Re=function(e){function t(e){var n;return Object(a.a)(this,t),(n=Object(i.a)(this,Object(o.a)(t).call(this,e))).state={notificationMessage:null,notificationStatus:null},n.closeNotification=n.closeNotification.bind(Object(A.a)(n)),n.handleDelete=n.handleDelete.bind(Object(A.a)(n)),n.handleSubmit=n.handleSubmit.bind(Object(A.a)(n)),n}return Object(c.a)(t,e),Object(r.a)(t,[{key:"componentDidMount",value:function(){var e=this.props.keycloak;e.initialized&&e.authenticated&&this.fetchData()}},{key:"componentDidUpdate",value:function(e){var t=this.props,n=t.keycloak,a=t.id,r=n.initialized&&n.authenticated,i=e.keycloak.authenticated!==r,o=a&&a!==e.id;r&&(o||i)&&this.fetchData()}},{key:"fetchData",value:function(){var e=Object(U.a)(I.a.mark((function e(){var t,n,a,r,i;return I.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t=this.props,n=t.keycloak,a=t.id,r=t.serviceUrl,!(n.initialized&&n.authenticated)||!a){e.next=13;break}return e.prev=3,e.next=6,X(r,a);case 6:i=e.sent,this.setState((function(){return{projectSubscription:i}})),e.next=13;break;case 10:e.prev=10,e.t0=e.catch(3),this.handleError(e.t0);case 13:case"end":return e.stop()}}),e,this,[[3,10]])})));return function(){return e.apply(this,arguments)}}()},{key:"closeNotification",value:function(){this.setState((function(){return{notificationMessage:null}}))}},{key:"handleSubmit",value:function(){var e=Object(U.a)(I.a.mark((function e(t){var n,a,r,i,o,c;return I.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n=this.props,a=n.t,r=n.onUpdate,i=n.keycloak,o=n.serviceUrl,!(i.initialized&&i.authenticated)){e.next=14;break}return e.prev=3,e.next=6,Q(o,t);case 6:c=e.sent,r(c),this.setState({projectSubscription:c,notificationMessage:a("common.dataSaved"),notificationStatus:fe.SUCCESS}),e.next=14;break;case 11:e.prev=11,e.t0=e.catch(3),this.handleError(e.t0);case 14:case"end":return e.stop()}}),e,this,[[3,11]])})));return function(t){return e.apply(this,arguments)}}()},{key:"handleDelete",value:function(){var e=Object(U.a)(I.a.mark((function e(t){var n,a,r,i,o;return I.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n=this.props,a=n.t,r=n.onDelete,i=n.keycloak,o=n.serviceUrl,!(i.initialized&&i.authenticated)){e.next=13;break}return e.prev=3,e.next=6,Z(o,t.id);case 6:r(t),this.setState({projectSubscription:null,notificationMessage:a("common.dataDeleted"),notificationStatus:fe.SUCCESS}),e.next=13;break;case 10:e.prev=10,e.t0=e.catch(3),this.handleError(e.t0);case 13:case"end":return e.stop()}}),e,this,[[3,10]])})));return function(t){return e.apply(this,arguments)}}()},{key:"handleError",value:function(e){var t=this.props,n=t.t;(0,t.onError)(e),this.setState((function(){return{notificationMessage:n("error.dataLoading"),notificationStatus:fe.ERROR}}))}},{key:"render",value:function(){var e,t=this.props,n=t.keycloak,a=t.onCancelEditing,r=t.t,i=this.state,o=i.notificationMessage,c=i.notificationStatus,s=i.projectSubscription;return e="undefined"===typeof s?r("entities.projectSubscription.notFound"):null===s?r("entities.projectSubscription.deleted"):d.a.createElement(Ae,{projectSubscription:s,onSubmit:this.handleSubmit,onCancelEditing:a,onDelete:this.handleDelete}),d.a.createElement(d.a.Fragment,null,d.a.createElement(q,{keycloak:n},r("common.notAuthenticated")),d.a.createElement(H,{keycloak:n},e),d.a.createElement(fe,{status:c,message:o,onClose:this.closeNotification}))}}]),t}(u.PureComponent);Re.defaultProps={onCancelEditing:function(){},onDelete:function(){},onUpdate:function(){},onError:function(){},serviceUrl:""};var Le=W(Object(S.b)()(Re)),ze=function(e){function t(e){var n;return Object(a.a)(this,t),(n=Object(i.a)(this,Object(o.a)(t).call(this,e))).state={notificationMessage:null,notificationStatus:null},n.closeNotification=n.closeNotification.bind(Object(A.a)(n)),n.handleSubmit=n.handleSubmit.bind(Object(A.a)(n)),n}return Object(c.a)(t,e),Object(r.a)(t,[{key:"closeNotification",value:function(){this.setState({notificationMessage:null})}},{key:"handleSubmit",value:function(){var e=Object(U.a)(I.a.mark((function e(t){var n,a,r,i,o,c;return I.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n=this.props,a=n.t,r=n.onCreate,i=n.keycloak,o=n.serviceUrl,!(i.initialized&&i.authenticated)){e.next=14;break}return e.prev=3,e.next=6,Y(o,t);case 6:c=e.sent,r(c),this.setState({notificationMessage:a("common.dataSaved"),notificationStatus:fe.SUCCESS}),e.next=14;break;case 11:e.prev=11,e.t0=e.catch(3),this.handleError(e.t0);case 14:case"end":return e.stop()}}),e,this,[[3,11]])})));return function(t){return e.apply(this,arguments)}}()},{key:"handleError",value:function(e){var t=this.props,n=t.onError,a=t.t;n(e),this.setState({notificationMessage:a("error.dataLoading"),notificationStatus:fe.ERROR})}},{key:"render",value:function(){var e=this.props,t=e.keycloak,n=e.onCancelEditing,a=e.t,r=this.state,i=r.notificationMessage,o=r.notificationStatus;return d.a.createElement(d.a.Fragment,null,d.a.createElement(q,{keycloak:t},a("common.notAuthenticated")),d.a.createElement(H,{keycloak:t},d.a.createElement(Ae,{onSubmit:this.handleSubmit,onCancelEditing:n})),d.a.createElement(fe,{status:o,message:i,onClose:this.closeNotification}))}}]),t}(u.PureComponent);ze.defaultProps={onError:function(){},onCancelEditing:function(){},onCreate:function(){},serviceUrl:""};var We=W(Object(S.b)()(ze));function He(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function qe(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?He(n,!0).forEach((function(t){Object(l.a)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):He(n).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var Je=function(){return window&&window.entando&&window.entando.keycloak&&qe({},window.entando.keycloak,{initialized:!0})||{initialized:!1}},Ke={id:"id",hidden:"hidden",locale:"locale",disableDefaultEventHandler:"disable-default-event-handler",serviceUrl:"service-url"},Ve=function(e){function t(){var e,n;Object(a.a)(this,t);for(var r=arguments.length,c=new Array(r),s=0;s<r;s++)c[s]=arguments[s];return(n=Object(i.a)(this,(e=Object(o.a)(t)).call.apply(e,[this].concat(c)))).keycloak=Je(),n.onCreate=M(T.create),n.onCancelEditing=M(T.cancelEditing),n.onDelete=M(T.delete),n.onUpdate=M(T.update),n.onErrorCreate=M(T.errorCreate),n.onErrorUpdate=M(T.errorUpdate),n}return Object(c.a)(t,e),Object(r.a)(t,[{key:"attributeChangedCallback",value:function(e,t,n){if(this.container&&t!==n){if(!Object.values(Ke).includes(e))throw new Error("Untracked changed attribute: ".concat(e));e===Ke.disableDefaultEventHandler&&this.onToggleDisableDefaultEvent(),this.render()}}},{key:"connectedCallback",value:function(){var e=this;this.container=document.createElement("div"),this.mountPoint=document.createElement("div"),this.container.appendChild(this.mountPoint);var t,n,a=this.attachShadow({mode:"open"});a.appendChild(this.container),this.jss=Object(O.b)(qe({},Object(m.a)(),{insertionPoint:this.container})),this.muiTheme=Object(j.a)({props:{MuiDialog:{container:this.mountPoint},MuiPopover:{container:this.mountPoint}}}),this.keycloak=qe({},Je(),{initialized:!0}),this.unsubscribeFromKeycloakEvent=(t="keycloak",n=function(){e.keycloak=qe({},Je(),{initialized:!0}),e.render()},window.addEventListener(t,n),function(){window.removeEventListener(t,n)}),this.onToggleDisableDefaultEvent(),this.render(),f()(a)}},{key:"disconnectedCallback",value:function(){this.unsubscribeFromWidgetEvents&&this.unsubscribeFromWidgetEvents(),this.unsubscribeFromKeycloakEvent&&this.unsubscribeFromKeycloakEvent()}},{key:"defaultWidgetEventHandler",value:function(){var e=this;return function(t){var n=N.tableAdd,a=N.cancelEditing,r=N.create,i=N.edit,o=N.delete,c=N.tableSelect,s=N.update,l=Ke.id;switch(t.type){case n:e.setAttribute(l,"");break;case i:e.hidden=!1,e.setAttribute(l,t.detail.payload.id);break;case r:case a:case s:e.hidden=!0;break;case o:e.hidden=!0,e.setAttribute(l,"");break;case c:e.setAttribute(l,t.detail.payload.id);break;default:throw new Error("Unsupported event: ".concat(t.type))}}}},{key:"onToggleDisableDefaultEvent",value:function(){var e,t,n="true"===this.getAttribute(Ke.disableDefaultEventHandler);if(n!==this.defaultEventHandlerDisabled){if(n)this.unsubscribeFromWidgetEvents&&this.unsubscribeFromWidgetEvents(),this.unsubscribeFromKeycloakEvent&&this.unsubscribeFromKeycloakEvent();else{var a=this.defaultWidgetEventHandler();this.unsubscribeFromWidgetEvents=(e=Object.values(N),t=a,e.forEach((function(e){return window.addEventListener(e,t)})),function(){e.forEach((function(e){return window.removeEventListener(e,t)}))})}this.defaultEventHandlerDisabled=n}}},{key:"render",value:function(){var e=this.getAttribute(Ke.serviceUrl)||"";if("true"===this.getAttribute(Ke.hidden))h.a.render(d.a.createElement(d.a.Fragment,null));else{var t=this.getAttribute(Ke.locale);x(t);var n=this.getAttribute(Ke.id),a=n?d.a.createElement(Le,{id:n,onUpdate:this.onUpdate,onError:this.onErrorUpdate,serviceUrl:e},null):d.a.createElement(We,{onCreate:this.onCreate,onError:this.onErrorCreate,serviceUrl:e},null);h.a.render(d.a.createElement(E.Provider,{value:this.keycloak},d.a.createElement(v.b,{jss:this.jss},d.a.createElement(g.a,{theme:this.muiTheme},a))),this.mountPoint)}}}],[{key:"observedAttributes",get:function(){return Object.values(Ke)}}]),t}(Object(s.a)(HTMLElement));customElements.define("project-subscription-form",Ve)}},[[225,1,2]]]);
//# sourceMappingURL=main.270a9518.chunk.js.map