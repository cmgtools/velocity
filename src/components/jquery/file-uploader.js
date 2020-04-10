/**
 * File Uploader plugin can be used to upload files. The appropriate backend code should be able to handle the file sent by this plugin.
 * It works fine for CMSGears using it's File Uploader and Avatar Uploader widgets.
 *
 * It also support two special cases using special classes as listed below:
 *
 * file-uploader-direct - To upload several files in a row.
 *
 * file-uploader-chooser - Always Show File Wrap and Chooser and keep Dragger hidden.
 */

// TODO: Validate for max file size if possible

// File Uploader Plugin
( function( cmtjq ) {

	cmtjq.fn.cmtFileUploader = function( options ) {

		// == Init == //

		// Configure Modules
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtFileUploader.defaults, options );
		var fileUploaders	= this;
		var cameraStream	= null;
		var videoPlayer		= null;

		// Iterate and initialise all the uploaders
		fileUploaders.each( function() {

			var fileUploader = cmtjq( this );

			init( fileUploader, cameraStream, videoPlayer );
		});

		// return control
		return;

		// == Private Functions == //

		// Initialise Uploader
		function init( fileUploader, cameraStream, videoPlayer ) {

			initBtnChooser( fileUploader );

			initBtnCapture( fileUploader, cameraStream, videoPlayer );

			// Always Show File Wrap and Chooser and keep Dragger hidden
			if( fileUploader.hasClass( 'file-uploader-chooser' ) ) {

				fileUploader.find( '.chooser-wrap' ).show();
				fileUploader.find( '.file-wrap' ).show();
				fileUploader.find( '.file-dragger' ).hide();
			}

			initUploader( fileUploader );
		}

		function initBtnChooser( fileUploader ) {

			// Show/Hide file chooser - either of the option must exist to choose file
			var btnChooser	= fileUploader.find( '.btn-chooser' );

			if( btnChooser.length > 0 ) {

				if( settings.direct || fileUploader.hasClass( 'file-uploader-direct' ) ) {

					fileUploader.addClass( 'file-uploader-direct' );

					btnChooser.hide();

					if( settings.toggle ) {

						fileUploader.find( '.chooser-wrap' ).show();
						fileUploader.find( '.file-wrap' ).hide();
					}
				}

				btnChooser.click( function() {

					if( settings.toggle ) {

						// Swap Chooser and Dragger
						fileUploader.find( '.chooser-wrap' ).fadeToggle( 'slow' );
						fileUploader.find( '.file-wrap' ).fadeToggle( 'fast' );
					}

					// Hide Postaction
					fileUploader.find( '.post-action' ).hide();

					// Reset Chooser
					fileUploader.find( '.file-chooser .input' ).val( "" );

					// Reset Canvas and Progress
					resetUploader( fileUploader );
				});
			}
		}

		function initBtnCapture( fileUploader, cameraStream, videoPlayer ) {

			// Capture Button
			var btnCapture = fileUploader.find( '.btn-capture' );

			if( btnCapture.length > 0 ) {

				btnCapture.click( function() {

					var camera = parseInt( btnCapture.attr( 'data-camera' ) );

					// Enable Camera
					if( camera == 0 ) {

						var stream = 'mediaDevices' in navigator;

						// Start Camera
						if( stream ) {

							navigator.mediaDevices.getUserMedia( { video: true } )
							.then( function( mediaStream ) {

								videoPlayer = fileUploader.find( '.file-camera .video' )[ 0 ];

								videoPlayer.srcObject = mediaStream;

								cameraStream = mediaStream;

								videoPlayer.play();
							})
							.catch( function( err ) {

								console.log( "Unable to access camera: " + err );
							});
						}
						else {

							alert( 'Your browser does not support media devices.' );

							return;
						}

						btnCapture.attr( 'data-camera', 1 );

						fileUploader.find( '.file-preloader .file-preloader-bar' ).html( '' );
					}
					// Disable Camera
					else {

						if( null != cameraStream ) {

							var track = cameraStream.getTracks()[0];

							track.stop();

							cameraStream = null;

							if( null != videoPlayer ) {

								videoPlayer.load();
							}
						}

						btnCapture.attr( 'data-camera', 0 );
					}

					if( settings.toggle ) {

						// Swap Chooser and Dragger
						fileUploader.find( '.chooser-wrap' ).fadeToggle( 'slow' );
						fileUploader.find( '.file-wrap' ).fadeToggle( 'fast' );
					}

					// Hide Postaction
					fileUploader.find( '.post-action' ).hide();

					// Reset Canvas and Progress
					resetUploader( fileUploader );
				});

				jQuery( '.file-capture' ).click( function() {

					if( null != cameraStream ) {

						uploadCapture( fileUploader, cameraStream, videoPlayer );
					}
				});
			}
		}

		function initUploader( fileUploader ) {

			// Modern Uploader
			if ( cmt.utils.browser.isFileApi() ) {

				// Traditional way using input
				var inputField = fileUploader.find( '.file-chooser .input' );

				inputField.change( function( event ) {

					handleFile( event, fileUploader );
				});

				// Modern way using Drag n Drop
				var dragElement = fileUploader.find( '.file-dragger .drag-wrap' );

				dragElement.bind( 'dragover', function( event ) {

					handleDragging( event );
				});

				dragElement.bind( 'dragleave', function( event ) {

					handleDragging( event );
				});

				dragElement.bind( 'drop', function( event ) {

					handleFile( event, fileUploader );
				});
			}
			// Form Data Uploader
			else if( cmt.utils.browser.isFormData() ) {

				var directory	= fileUploader.attr( 'directory' );
				var type		= fileUploader.attr( 'type' );
				var gen			= fileUploader.attr( 'gen' );
				var inputField 	= fileUploader.find( '.file-chooser .input' );

				inputField.change( function( event ) {

					uploadTraditionalFile( fileUploader, directory, type, gen );
				});
			}
		}

		function resetUploader( fileUploader ) {

			// Clear Old Values
			if( cmt.utils.browser.isCanvas() && fileUploader.attr( 'type' ) == 'image' ) {

				var canvasArr = fileUploader.find( '.file-dragger canvas, .file-camera .canvas' );

				if( canvasArr.length > 0 ) {

					var canvas	= canvasArr[ 0 ];
					var context = canvas.getContext( '2d' );

					context.clearRect( 0, 0, canvas.width, canvas.height );
				}
			}

			var progressContainer = fileUploader.find( '.file-preloader .file-preloader-bar' );

			// Modern Uploader
			if( cmt.utils.browser.isFileApi() ) {

				progressContainer.css( "width", "0%" );
			}
			// Form Data Uploader
			else if( cmt.utils.browser.isFormData() ) {

				progressContainer.html( "" );
			}
		}

		function handleDragging( event ) {

			event.stopPropagation();
			event.preventDefault();

			event.target.className = ( event.type == "dragover" ? "dragger-hover" : "" );
		}

		function handleFile( event, fileUploader ) {

			var directory	= fileUploader.attr( 'directory' );
			var type		= fileUploader.attr( 'type' );
			var gen			= fileUploader.attr( 'gen' );

			// cancel event and add hover styling
			handleDragging( event );

			// FileList
			var files = event.target.files || event.originalEvent.dataTransfer.files;

			// Draw if image
			if( settings.preview && cmt.utils.browser.isCanvas() && type == 'image' ) {

				var canvas = fileUploader.find( '.file-dragger canvas' );

				if( canvas.length > 0 ) {

					canvas.show();

					cmt.utils.image.drawAtCanvasCenter( canvas[0], files[0] );
				}
			}

			// Upload File
			uploadFile( fileUploader, directory, type, gen, files[0] );
		}

		function uploadFile( fileUploader, directory, type, gen, file ) {

			var xhr 				= new XMLHttpRequest();
			var fileType			= file.type.toLowerCase();
			var isValidFile			= jQuery.inArray( fileType, settings.fileFormats );
			var progressContainer	= fileUploader.find( '.file-preloader .file-preloader-bar' );
			var formData 			= new FormData();

			// append form data
			formData.append( 'file', file );

			// reset progress bar
			progressContainer.css( "width", "0%" );

			// upload file
			if( xhr.upload && isValidFile ) {

				// Upload progress
				xhr.upload.onprogress = function( e ) {

					if( e.lengthComputable ) {

						var progress = Math.round( ( e.loaded * 100 ) / e.total );

						progressContainer.css( "width", progress + "%" );
					}
				};

				// file received/failed
				xhr.onreadystatechange = function( e ) {

					if ( xhr.readyState == 4 ) {

						if( xhr.status == 200 ) {

							var jsonResponse = JSON.parse( xhr.responseText );

							if( jsonResponse[ 'result' ] == 1 ) {

								var responseData = jsonResponse[ 'data' ];

								if( settings.uploadListener ) {

									settings.uploadListener( fileUploader, directory, type, gen, responseData );
								}
								else {

									fileUploaded( fileUploader, directory, type, gen, responseData );
								}
							}
							else {

								var responseData = jsonResponse[ 'errors' ];

								alert( responseData.error );
							}

							// Reset Canvas and Progress
							resetUploader( fileUploader );
						}
					}
				};

				var urlParams = fileUploadUrl + "?directory=" + encodeURIComponent( directory ) + "&type=" + encodeURIComponent( type ) + "&gen=" + encodeURIComponent( gen );

				// start upload
				xhr.open("POST", urlParams, true );
				xhr.send( formData );
			}
			else {

				alert( "File format not allowed." );
			}
		}

		// TODO; Test it well
		function uploadTraditionalFile( fileUploader, directory, type, gen ) {

			var progressContainer	= fileUploader.find( '.file-preloader .file-preloader-bar' );
			var fileList			= fileUploader.find( '.file-chooser .input' );
			var file 				= fileList.files[ 0 ];
			var formData 			= new FormData();
			fileName 				= file.name;

			// Show progress
			progressContainer.html( 'Uploading file' );

			formData.append( 'file', file );

			var urlParams = fileUploadUrl + "?directory=" + encodeURIComponent( directory ) + "&type=" + encodeURIComponent( type ) + "&gen=" + encodeURIComponent( gen );

			jQuery.ajax({
			  type:			"POST",
			  url: 			urlParams,
			  data: 		formData,
		      cache: 		false,
		      contentType: 	false,
		      processData: 	false,
			  dataType:		'json',
			}).done( function( response ) {

				progressContainer.html( 'File uploaded' );

				if( response['result'] == 1 ) {

					if( settings.uploadListener ) {

						settings.uploadListener( fileUploader, directory, type, gen, response[ 'data' ] );
					}
					else {

						fileUploaded( fileUploader, directory, type, gen, response[ 'data' ] );
					}
				}
				else {

					var errors = response[ 'errors' ];

					alert( errors.error );
				}

				// Reset Canvas and Progress
				resetUploader( fileUploader );
			});
		}

		function uploadCapture( fileUploader, cameraStream, videoPlayer ) {

			var directory	= fileUploader.attr( 'directory' );
			var type		= fileUploader.attr( 'type' );
			var gen			= fileUploader.attr( 'gen' );
			var canvas		= fileUploader.find( '.file-camera .canvas' );
			var fileName	= canvas.attr( 'data-name' );
			canvas			= canvas[ 0 ];
			var context		= canvas.getContext( '2d' );

			context.drawImage( videoPlayer, 0, 0, canvas.width, canvas.height );

			var dataURI		= canvas.toDataURL( "image/png" );
			var imageData	= cmt.utils.data.dataURItoBlob( dataURI );

			var progressContainer = fileUploader.find( '.file-preloader .file-preloader-bar' );

			var formData = new FormData();

			// Show progress
			progressContainer.html( 'Uploading file' );

			formData.append( 'file', imageData, fileName );

			var urlParams = fileUploadUrl + "?directory=" + encodeURIComponent( directory ) + "&type=" + encodeURIComponent( type ) + "&gen=" + encodeURIComponent( gen );

			jQuery.ajax({
			  type:			"POST",
			  url: 			urlParams,
			  data: 		formData,
		      cache: 		false,
		      contentType: 	false,
		      processData: 	false,
			  dataType:		'json',
			}).done( function( response ) {

				progressContainer.html( 'File uploaded' );

				if( response['result'] == 1 ) {

					if( settings.uploadListener ) {

						settings.uploadListener( fileUploader, directory, type, gen, response[ 'data' ] );
					}
					else {

						fileUploaded( fileUploader, directory, type, gen, response[ 'data' ] );

						if( null != cameraStream ) {

							var track = cameraStream.getTracks()[ 0 ];

							track.stop();

							cameraStream = null;

							if( null != videoPlayer ) {

								videoPlayer.load();
							}
						}

						fileUploader.find( '.btn-capture' ).attr( 'data-camera', 0 );
					}
				}
				else {

					var errors = response[ 'errors' ];

					alert( errors.error );
				}

				// Reset Canvas and Progress
				resetUploader( fileUploader );
			});
		}

		// default post processor for uploaded files.
		function fileUploaded( fileUploader, directory, type, gen, result ) {

			var fileName = result[ 'name' ] + "." + result[ 'extension' ];

			if( null == type || typeof type == 'undefined' ) {

				type = result[ 'type' ];
			}

			switch( type ) {

				case "image": {

					fileUploader.find( '.file-data' ).html( "<img src='" + result['tempUrl'] + "' class='fluid' />" );

					updateFileData( fileUploader, type, result );

					break;
				}
				case "video": {

					fileUploader.find( '.file-data' ).html( "<video src='" + result['tempUrl'] + "' controls class='fluid'>Video not supported.</video>" );

					updateFileData( fileUploader, type, result );

					break;
				}
				case "document":
				case "mixed":
				case "compressed":
				case "shared": {

					fileUploader.find( '.file-data' ).html( "<i class='" + settings.docSuccessIcon + "'></i>" );

					updateFileData( fileUploader, type, result );

					break;
				}
			}

			if( settings.toggle ) {

				// Swap Chooser and File Wrap
				fileUploader.find( '.chooser-wrap' ).fadeToggle( 'fast' );

				if( !fileUploader.hasClass( 'file-uploader-chooser' ) ) {

					fileUploader.find( '.file-wrap' ).fadeToggle( 'slow' );
				}
			}

			// Show Clear and Postaction
			fileUploader.find( '.file-clear' ).fadeIn();
			fileUploader.find( '.post-action' ).fadeIn();
		}

		function updateFileData( fileUploader, type, result ) {

			var fileInfo	= fileUploader.find( '.file-info' );
			var fileFields	= fileUploader.find( '.file-fields' );

			fileInfo.find( '.name' ).val( result[ 'name' ] );
			fileInfo.find( '.type' ).val( type );
			fileInfo.find( '.extension' ).val( result[ 'extension' ] );
			fileInfo.find( '.change' ).val( 1 );

			var title = fileFields.find( '.title' ).val();

			if( null == title || title.length == 0 ) {

				fileFields.find( '.title' ).val( result[ 'title' ] );
			}
		}
	};

	// Default Settings
	cmtjq.fn.cmtFileUploader.defaults = {
		fileFormats: [ "jpg", "jpeg", "png", "gif", "pdf", "csv" ],
		direct: false,
		uploadListener: null,
		preview: true,
		toggle: true,
		docSuccessIcon: 'cmti cmti-3x cmti-check'
	};

})( jQuery );
